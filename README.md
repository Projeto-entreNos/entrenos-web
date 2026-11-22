# EntreNós

Plataforma que conecta **empresas** a serviços de **universidades parceiras**: apoio contábil e financeiro, consultoria em gestão e negócios, apoio educacional e idiomas, capacitação em tecnologia básica e assessoria jurídica. O atendimento é feito por alunos, com supervisão de professores.

A empresa contrata um pacote, pago por colaborador, e oferece os serviços como benefício à equipe. O colaborador escolhe um serviço e envia a solicitação. A universidade recebe o pedido por e-mail, e a equipe EntreNós acompanha tudo pelo painel administrativo.

> Projeto acadêmico (MVP). Todos os dados de exemplo (empresas, pessoas, universidades, e-mails e CNPJs) são fictícios.

**Endereço publicado:** https://entrenos-api-eue3ewe4htgmaxhr.brazilsouth-01.azurewebsites.net

## Perfis

| Perfil | O que faz |
|---|---|
| Colaborador | Vê os serviços do pacote da empresa, faz solicitações e acompanha o andamento. |
| Empresa | Vê o contrato e as vagas, convida e remove colaboradores. |
| Admin (equipe EntreNós) | Cadastra empresas e serviços e atualiza o status das solicitações. |

## Tecnologias

- **Front-end:** React com Vite, React Router e ícones do `lucide-react`. Estilos em CSS puro, com variáveis geradas a partir do Figma.
- **Back-end:** API em ASP.NET Core com .NET 10 e Entity Framework Core.
- **Banco de dados:** SQL Server na máquina de quem desenvolve; Azure SQL na publicação.
- **Publicação:** Azure App Service (a API serve também o front), com implantação pelo GitHub Actions.

## Estrutura das pastas

```
├── .github/workflows/   publicação automática no Azure (GitHub Actions)
├── backend/EntreNos.Api API em ASP.NET Core
│   ├── Controllers/     endereços da API (/api/...)
│   ├── Services/        regras de negócio
│   ├── Models/          tabelas do banco (Entity Framework Core)
│   ├── Dtos/            formatos dos pedidos e respostas
│   ├── Auth/            login com JWT
│   └── Http/            pedidos de exemplo para testar a API
├── database/            scripts do banco (estrutura, dados de exemplo e senhas de teste)
├── frontend/            front-end em React (Vite)
│   └── src/
│       ├── components/  componentes reutilizáveis
│       ├── layouts/     layout público e layout logado
│       ├── pages/       uma pasta por tela
│       ├── services/    acesso à API (ou aos dados de exemplo)
│       ├── mocks/       dados de exemplo usados sem a API
│       ├── context/     sessão de quem está logado
│       ├── styles/      variáveis (tokens.css), fontes e estilos globais
│       └── utils/       funções compartilhadas
└── scripts/             geração do pacote da demonstração offline
```

## Como rodar no desenvolvimento

Pré-requisitos: [Node.js](https://nodejs.org) (versão LTS), [SDK do .NET 10](https://dotnet.microsoft.com/download) e SQL Server (o Express basta), com o SSMS ou o `sqlcmd` para rodar os scripts.

### 1. Banco de dados

Crie um banco vazio e rode, nesta ordem, `database/01_estrutura.sql`, `02_dados_iniciais.sql` e `04_senhas_teste.sql`. O passo a passo está em [`database/LEIA-ME.md`](database/LEIA-ME.md). Para voltar aos dados de exemplo, rode os três de novo.

### 2. API

As configurações secretas ficam nos User Secrets da sua máquina, nunca no repositório. Na pasta `backend/EntreNos.Api`:

```
dotnet user-secrets set "Jwt:Chave" "<texto aleatório com 32 caracteres ou mais>"
dotnet user-secrets set "ConnectionStrings:EntreNos" "<connection string do seu banco local>"
dotnet run --launch-profile http
```

A API sobe em http://localhost:5153. Em desenvolvimento, a documentação fica em http://localhost:5153/swagger, e a pasta `Http/` tem pedidos de exemplo.

### 3. Front-end

Na pasta `frontend`:

```
npm install
copy .env.example .env.local
npm run dev
```

O front abre em http://localhost:5173 e usa a API da etapa 2. Os usuários de teste (um por perfil) e a senha fictícia deles estão em `database/04_senhas_teste.sql`. Para testar uma tela sem a API, ligue o modo de dados de exemplo em `USAR_MOCK`, no arquivo `src/services/api.js`.

### Conferências antes do commit

```
npm run lint        (em frontend/)
npm run build       (em frontend/)
dotnet build        (em backend/EntreNos.Api/)
```

## Publicação

A cada push no `main` que mude `backend/`, `frontend/` ou o workflow, o GitHub Actions (`.github/workflows/main_entrenos-api.yml`):

1. gera o build do front com `VITE_API_URL=/api`;
2. publica a API e copia o front para a pasta `wwwroot` dela;
3. envia tudo para o Azure App Service.

Front e API ficam no mesmo endereço. A chave do JWT, a connection string do Azure SQL e o `UrlFront` ficam nas configurações do App Service, no portal do Azure.

## Demonstração offline

Para apresentar sem internet, o projeto gera um pacote que roda num notebook Windows só com o SQL Server Express instalado (o .NET vem dentro do pacote).

- **Gerar** (na máquina de quem desenvolve, com internet): `powershell -ExecutionPolicy Bypass -File scripts\gerar-pacote-demo.ps1`. O arquivo `entrenos-demo.zip` é criado na pasta `entrenos-demo-pacote`, ao lado do repositório.
- **Usar:** copie o .zip para o notebook, extraia e dê dois cliques em `iniciar-demo.bat`. O script recria o banco com os dados de exemplo e abre o navegador. Instalação do SQL Server, solução de problemas e checklists estão no `LEIA-ME-demo.md`, dentro do pacote.

## Equipe

- Athylla Alan
- Eduardo Yonezawa
- Gabriel Vitor
- Gustavo Sales
- João Pedro
- Nadyja Maria
- Victor Melo