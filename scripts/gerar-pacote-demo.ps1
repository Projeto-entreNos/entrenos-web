param(
    [string]$Destino = (Join-Path (Split-Path (Split-Path $PSScriptRoot)) 'entrenos-demo-pacote')
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path $PSScriptRoot
$montagem = Join-Path $Destino 'entrenos-demo'
$zip = Join-Path $Destino 'entrenos-demo.zip'

function Rodar($descricao, [scriptblock]$comando) {
    Write-Host $descricao -ForegroundColor Cyan
    & $comando
    if ($LASTEXITCODE -ne 0) { throw "Falhou: $descricao" }
}

if (($Destino + '\').StartsWith($raiz + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw "O pacote não pode ficar dentro do repositório ($raiz). Escolha outra pasta em -Destino."
}

if (Test-Path $montagem) { Remove-Item -Recurse -Force $montagem }
New-Item -ItemType Directory -Force $montagem | Out-Null

Push-Location (Join-Path $raiz 'frontend')
try {
    if (-not (Test-Path 'node_modules')) {
        Rodar 'Instalando as dependências do front (npm ci)...' { npm ci }
    }
    # Front e API no mesmo endereço, como no Azure
    $env:VITE_API_URL = '/api'
    Rodar 'Gerando o build do front...' { npm run build }
} finally {
    Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
    Pop-Location
}

$js = (Get-ChildItem (Join-Path $raiz 'frontend\dist\assets') -Filter *.js | ForEach-Object { Get-Content $_.FullName -Raw }) -join "`n"
if ($js -notmatch '`/api`' -or $js -match 'localhost:5153') {
    throw 'O build do front não ficou com VITE_API_URL=/api.'
}

# self-contained: o notebook não precisa ter o .NET instalado
$app = Join-Path $montagem 'app'
Rodar 'Publicando a API (self-contained, win-x64)...' {
    dotnet publish (Join-Path $raiz 'backend\EntreNos.Api\EntreNos.Api.csproj') -c Release -r win-x64 --self-contained true -o $app -nologo
}
Remove-Item (Join-Path $app 'appsettings.Development.json') -ErrorAction SilentlyContinue

Write-Host 'Montando o pacote...' -ForegroundColor Cyan
Copy-Item -Recurse (Join-Path $raiz 'frontend\dist') (Join-Path $app 'wwwroot')
$banco = New-Item -ItemType Directory (Join-Path $montagem 'banco')
foreach ($arquivo in '01_estrutura.sql', '02_dados_iniciais.sql', '04_senhas_teste.sql') {
    Copy-Item (Join-Path $raiz "database\$arquivo") $banco
}
Copy-Item (Join-Path $PSScriptRoot 'demo\*') $montagem

if (Test-Path $zip) { Remove-Item -Force $zip }
Add-Type -AssemblyName System.IO.Compression.FileSystem
# Monta o .zip arquivo por arquivo para os caminhos usarem "/", que todo extrator entende
$arquivoZip = [System.IO.Compression.ZipFile]::Open($zip, 'Create')
try {
    foreach ($arquivo in Get-ChildItem $montagem -Recurse -File) {
        $caminho = 'entrenos-demo/' + $arquivo.FullName.Substring($montagem.Length + 1).Replace('\', '/')
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($arquivoZip, $arquivo.FullName, $caminho, 'Optimal')
    }
} finally {
    $arquivoZip.Dispose()
}
Remove-Item -Recurse -Force $montagem

$tamanho = [math]::Round((Get-Item $zip).Length / 1MB)
Write-Host ''
Write-Host "Pacote pronto: $zip ($tamanho MB)" -ForegroundColor Green
Write-Host 'Copie o .zip para o notebook, extraia e dê dois cliques em iniciar-demo.bat.'
