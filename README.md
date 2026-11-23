# EntreNós

Plataforma que conecta **empresas** a serviços de **universidades parceiras** (apoio contábil e financeiro, gestão e negócios, educação e idiomas, tecnologia básica e assessoria jurídica), atendidos por alunos com supervisão de professores. A empresa contrata um pacote por colaborador e oferece os serviços como benefício.

> Projeto acadêmico (MVP). Todos os dados de exemplo são fictícios.

**Endereço publicado:** https://entrenos-api-eue3ewe4htgmaxhr.brazilsouth-01.azurewebsites.net

## Perfis

| Perfil | O que faz |
|---|---|
| Colaborador | Vê os serviços do pacote, faz solicitações e acompanha o andamento. |
| Empresa | Vê o contrato e as vagas, convida e remove colaboradores. |
| Admin | Cadastra empresas e serviços e atualiza o status das solicitações. |

## Tecnologias

React (Vite) · ASP.NET Core (.NET 10) · Entity Framework Core · SQL Server / Azure SQL · Azure App Service · GitHub Actions

## Como rodar

Pré-requisitos: Node.js (LTS), SDK do .NET 10 e SQL Server Express.

1. **Banco:** rode `database/01_estrutura.sql`, `02_dados_iniciais.sql` e `04_senhas_teste.sql` (detalhes em [`database/LEIA-ME.md`](database/LEIA-ME.md)).
2. **API** (em `backend/EntreNos.Api`): grave `Jwt:Chave` e `ConnectionStrings:EntreNos` nos User Secrets e rode `dotnet run --launch-profile http`. Ela sobe em http://localhost:5153.
3. **Front** (em `frontend`): `npm install`, `copy .env.example .env.local` e `npm run dev`. Ele abre em http://localhost:5173.

## Publicação

A cada merge no `main` que mude `backend/` ou `frontend/`, o GitHub Actions publica front e API juntos no Azure App Service.

## Próximos passos (fora do MVP)

Busca com IA · envio real de e-mails · redefinição de senha · cadastro de universidades e categorias no admin

## Equipe

Athylla Alan · Eduardo Yonezawa · Gabriel Vitor · Gustavo Sales · João Pedro · Nadyja Maria · Victor Melo
