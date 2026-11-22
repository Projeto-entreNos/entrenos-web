param(
    [string]$Instancia = 'localhost\SQLEXPRESS',
    [int]$Porta = 5080,
    [switch]$SemNavegador
)

$ErrorActionPreference = 'Stop'
$pasta = $PSScriptRoot
$nomeBanco = 'EntreNosDemo'
$endereco = "http://localhost:$Porta"

function Parar($mensagem) {
    Write-Host ''
    Write-Host $mensagem -ForegroundColor Red
    Write-Host ''
    Write-Host 'Leia o LEIA-ME-demo.md, nesta pasta, para ver como resolver.'
    exit 1
}

function Texto-Erro($erro) {
    if ($erro.Exception.InnerException) { return $erro.Exception.InnerException.Message }
    return $erro.Exception.Message
}

function Executar-Script($conexao, $sql) {
    # O "GO" separa os lotes do script; o SqlClient roda um lote por vez
    $lotes = [regex]::Split($sql, '^\s*GO\s*$', 'Multiline, IgnoreCase')
    foreach ($lote in $lotes) {
        if ($lote.Trim() -eq '') { continue }
        $comando = $conexao.CreateCommand()
        $comando.CommandText = $lote
        $comando.CommandTimeout = 120
        [void]$comando.ExecuteNonQuery()
    }
}

Write-Host ''
Write-Host 'EntreNós: demonstração sem internet' -ForegroundColor Cyan
Write-Host ''

if ($PSVersionTable.PSEdition -ne 'Desktop') {
    Parar 'Abra a demo pelo arquivo iniciar-demo.bat (ele usa o Windows PowerShell, que já tem o que é preciso para falar com o SQL Server).'
}
Add-Type -AssemblyName System.Data

$exe = Join-Path $pasta 'app\EntreNos.Api.exe'
if (-not (Test-Path $exe)) {
    Parar "Não encontrei $exe. Extraia o .zip inteiro antes de rodar a demo."
}

# A porta vem antes do banco: com a demo já aberta, recriar o banco apagaria o que está em uso
Write-Host "1/4 Conferindo a porta $Porta..."
$ocupada = Get-NetTCPConnection -LocalPort $Porta -State Listen -ErrorAction SilentlyContinue
if ($ocupada) {
    Parar "A porta $Porta já está em uso: a demo provavelmente já está aberta em outra janela. Use essa janela ou feche-a. Para usar outra porta: .\iniciar-demo.bat -Porta 5081"
}

Write-Host "2/4 Conferindo o SQL Server ($Instancia)..."
if ($Instancia.Contains('\')) {
    $servico = 'MSSQL$' + $Instancia.Split('\')[1]
} else {
    $servico = 'MSSQLSERVER'
}
$estado = Get-Service -Name $servico -ErrorAction SilentlyContinue
if ($null -eq $estado) {
    Parar "O SQL Server não está instalado neste computador (não existe o serviço $servico). Instale o SQL Server Express, como explica o LEIA-ME-demo.md."
}
if ($estado.Status -ne 'Running') {
    try {
        Start-Service -Name $servico
    } catch {
        Parar "O SQL Server está instalado, mas parado. Abra o menu Iniciar, procure por 'Serviços', clique com o botão direito em 'SQL Server ($($Instancia.Split('\')[-1]))' e escolha Iniciar. Depois rode a demo de novo."
    }
}

$conexaoMaster = "Server=$Instancia;Database=master;Integrated Security=True;Connect Timeout=15;Pooling=False"
try {
    $master = New-Object System.Data.SqlClient.SqlConnection $conexaoMaster
    $master.Open()
} catch {
    Parar "Não consegui conectar no SQL Server ($Instancia): $(Texto-Erro $_)"
}

Write-Host "3/4 Recriando o banco $nomeBanco com os dados de exemplo..."
try {
    Executar-Script $master @"
IF DB_ID(N'$nomeBanco') IS NOT NULL
BEGIN
    ALTER DATABASE [$nomeBanco] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [$nomeBanco];
END;
CREATE DATABASE [$nomeBanco];
"@
    $master.Close()

    $banco = New-Object System.Data.SqlClient.SqlConnection "Server=$Instancia;Database=$nomeBanco;Integrated Security=True;Connect Timeout=15;Pooling=False"
    $banco.Open()
    foreach ($arquivo in '01_estrutura.sql', '02_dados_iniciais.sql', '04_senhas_teste.sql') {
        $sql = Get-Content -Path (Join-Path $pasta "banco\$arquivo") -Raw -Encoding UTF8
        Executar-Script $banco $sql
        Write-Host "    ok $arquivo"
    }
    $banco.Close()
} catch {
    Parar "Erro ao criar o banco: $(Texto-Erro $_)"
}

Write-Host '4/4 Subindo o EntreNós...'
# A chave do JWT é nova a cada execução e, como a connection string, só existe neste processo
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$env:Jwt__Chave = [Convert]::ToBase64String($bytes)
$env:ConnectionStrings__EntreNos = "Server=$Instancia;Database=$nomeBanco;Trusted_Connection=True;TrustServerCertificate=True"
$env:UrlFront = $endereco
$env:ASPNETCORE_ENVIRONMENT = 'Production'
$env:ASPNETCORE_URLS = $endereco
[Environment]::SetEnvironmentVariable('Logging__LogLevel__Microsoft.EntityFrameworkCore', 'Warning')

Get-ChildItem -Path $pasta -Recurse | Unblock-File
$api = Start-Process -FilePath $exe -WorkingDirectory (Join-Path $pasta 'app') -NoNewWindow -PassThru

$pronta = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 1
    if ($api.HasExited) { break }
    try {
        $resposta = Invoke-WebRequest -Uri "$endereco/api/pacotes" -UseBasicParsing -TimeoutSec 5
        if ($resposta.StatusCode -eq 200) { $pronta = $true; break }
    } catch { }
}
if (-not $pronta) {
    if (-not $api.HasExited) { Stop-Process -Id $api.Id -Force }
    Parar 'A API não respondeu. Veja as mensagens acima desta linha.'
}

Write-Host ''
Write-Host "Pronto! Abra $endereco no navegador." -ForegroundColor Green
Write-Host 'Usuários (senha teste123): colaborador@teste.entrenos, empresa@teste.entrenos e admin@teste.entrenos'
Write-Host 'Para encerrar, feche esta janela ou aperte Ctrl+C.'
Write-Host ''
if (-not $SemNavegador) {
    Start-Process $endereco
}
Wait-Process -Id $api.Id
