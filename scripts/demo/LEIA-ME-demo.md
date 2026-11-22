# EntreNós: demonstração sem internet

Este pacote roda o EntreNós inteiro (site e API) num notebook Windows, **sem internet**. O notebook só precisa ter o **SQL Server Express**. O .NET já vem dentro do pacote, e o banco é criado pelo próprio script.

## O que tem no pacote

| Item | O que é |
|---|---|
| `iniciar-demo.bat` | Abre a demo. É o único arquivo em que você precisa clicar. |
| `iniciar-demo.ps1` | O script que o `.bat` roda: confere o SQL Server, recria o banco e sobe o sistema. |
| `app/` | A API já publicada, com o site dentro (`app/wwwroot`). |
| `banco/` | Os scripts do banco: estrutura, dados de exemplo e senhas de teste. |

## 1. Antes do dia, com internet: instalar o SQL Server Express

Faça isto uma vez em cada notebook, com internet.

1. Abra https://www.microsoft.com/sql-server/sql-server-downloads e baixe o **Express** (2022 ou mais novo).
2. Abra o instalador e escolha **Básico** (Basic). Aceite os termos e clique em **Instalar**. Ele baixa o que precisa e leva alguns minutos.
3. Mantenha o nome da instância padrão: **SQLEXPRESS**. No fim, a tela mostra `localhost\SQLEXPRESS`.
4. Instale com o **mesmo usuário do Windows** que vai abrir a demo no dia. Esse usuário vira administrador do SQL Server e consegue criar o banco.

Não precisa instalar o SSMS, o `sqlcmd` nem o .NET.

## 2. Rodar a demo

1. Copie o `entrenos-demo.zip` para o notebook e extraia numa pasta simples, por exemplo `C:\EntreNos`. Extraia o .zip inteiro; não rode de dentro dele.
2. Dê dois cliques em `iniciar-demo.bat`.
3. A janela mostra 4 passos. No fim, aparece "Pronto!" e o navegador abre em **http://localhost:5080**.
4. Deixe essa janela aberta durante a apresentação. Para encerrar, feche a janela ou aperte `Ctrl+C`.

Usuários de teste (senha de todos: **teste123**):

| Perfil | E-mail | Tela inicial |
|---|---|---|
| Colaborador | colaborador@teste.entrenos | Benefícios |
| Empresa | empresa@teste.entrenos | Empresa |
| Admin | admin@teste.entrenos | Admin: Empresas |

**Toda vez que a demo abre, o banco `EntreNosDemo` volta aos dados de exemplo.** Para desfazer o que foi feito num ensaio, é só fechar e abrir de novo.

A chave de login (JWT) é gerada na hora e só existe enquanto a janela está aberta. Ao reabrir a demo, quem estava logado precisa entrar de novo.

### Outra instância ou outra porta

Abra o PowerShell na pasta do pacote e rode:

```
.\iniciar-demo.bat -Instancia "localhost\OUTRANOME"
.\iniciar-demo.bat -Porta 5081
```

## 3. Se algo der errado

| Mensagem | O que fazer |
|---|---|
| "O SQL Server não está instalado" | Instale o SQL Server Express (passo 1). Precisa de internet. |
| "O SQL Server está instalado, mas parado" | Menu Iniciar > **Serviços** > botão direito em **SQL Server (SQLEXPRESS)** > **Iniciar**. |
| "Não consegui conectar no SQL Server" | Confira o nome da instância na tela final do instalador. Se for outro, use `-Instancia`. |
| "Erro ao criar o banco" com "permissão" ou "permission" | O usuário do Windows não é administrador do SQL Server. Abra a demo com o usuário que instalou o SQL Server. |
| "A porta 5080 já está em uso" | A demo já está aberta em outra janela. Use essa janela ou feche-a. |
| O navegador não abriu | Abra o Edge e digite http://localhost:5080. |
| O Windows mostrou "O Windows protegeu o computador" | Clique em **Mais informações** > **Executar assim mesmo**. |

## 4. Checklist da véspera (em cada notebook)

- [ ] O SQL Server Express está instalado, e a demo já foi aberta pelo menos uma vez **com o Wi-Fi desligado**.
- [ ] O .zip está extraído em `C:\EntreNos` (e também num pen drive, de reserva).
- [ ] Login com os 3 usuários funcionando.
- [ ] Ensaiar o roteiro:
  - colaborador: ver Benefícios, buscar um serviço, solicitar, ver em Minhas solicitações e cancelar;
  - empresa: ver o contrato e as vagas, convidar um colaborador e remover outro;
  - admin: ver Empresas e Serviços, e mudar o status de uma solicitação.
- [ ] Zoom do navegador em 100% (`Ctrl+0`). Teste na resolução do projetor, se souber qual é.
- [ ] Notebook na tomada, sem atualização do Windows pendente e com o modo de suspensão desligado.
- [ ] Fechar a demo depois do ensaio, para o banco voltar aos dados de exemplo no dia.

## 5. Checklist de 10 minutos antes

- [ ] Notebook na tomada e com o Wi-Fi desligado (assim não aparece nenhum aviso de rede no meio).
- [ ] Dois cliques em `iniciar-demo.bat` e esperar o "Pronto!".
- [ ] Navegador em tela cheia (`F11`), com o zoom em 100%, na landing (http://localhost:5080).
- [ ] Abrir uma aba anônima (`Ctrl+Shift+N`) para trocar de perfil sem precisar sair da conta.
- [ ] Notificações do Windows desligadas (Assistente de foco / Não incomodar).
- [ ] O segundo notebook com a demo já aberta, como reserva.
