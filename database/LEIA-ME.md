# Banco de dados do EntreNós

Scripts do banco em SQL Server, feitos a partir do que o front-end já usa (`frontend/src/mocks` e os comentários de `frontend/src/services`).

## Como criar o banco local (SSMS)

1. Abra o SQL Server Management Studio e conecte em `localhost\SQLEXPRESS` com **Autenticação do Windows**.
2. Crie o banco: clique com o botão direito em **Bancos de Dados > Novo Banco de Dados**, dê o nome `EntreNos` e clique em OK.
3. Abra cada script (**Arquivo > Abrir > Arquivo**), escolha o banco `EntreNos` na lista do alto da tela e clique em **Executar** (F5), nesta ordem:

| Ordem | Script | O que faz |
|---|---|---|
| 1 | `01_estrutura.sql` | Apaga e cria todas as tabelas. Pode ser rodado de novo quando quiser zerar o banco. |
| 2 | `02_dados_iniciais.sql` | Coloca os dados de exemplo (os mesmos dos mocks). Rode sempre logo depois do 01. |
| 3 | `03_consultas_exemplo.sql` | Só consulta. Mostra como o back-end busca os dados de cada tela. |
| 4 | `04_senhas_teste.sql` | Grava a senha fictícia "teste123" nos 3 usuários de teste, para o login funcionar. Rode sempre depois do 02. Só em banco de teste. |

> Atenção: rodar o `01` apaga todos os dados do banco escolhido. Confira o banco selecionado antes de executar.

Também dá para rodar pelo terminal, se tiver o `sqlcmd`:

```
sqlcmd -S localhost\SQLEXPRESS -E -C -f 65001 -d EntreNos -i 01_estrutura.sql
sqlcmd -S localhost\SQLEXPRESS -E -C -f 65001 -d EntreNos -i 02_dados_iniciais.sql
sqlcmd -S localhost\SQLEXPRESS -E -C -f 65001 -d EntreNos -i 03_consultas_exemplo.sql
sqlcmd -S localhost\SQLEXPRESS -E -C -f 65001 -d EntreNos -i 04_senhas_teste.sql
```

Nenhum script tem connection string, senha ou chave. A connection string fica só na configuração do back-end, fora do repositório.

## O que cada tabela guarda

| Tabela | Guarda |
|---|---|
| `Pacotes` | Os pacotes Essencial e Completo: código (`essencial`, `completo`), nome, descrição, benefícios (um por linha), preço por colaborador por mês e limite de atendimentos por mês. |
| `Categorias` | As 5 categorias do catálogo, na ordem da landing. |
| `Universidades` | Universidades parceiras e o e-mail que recebe as solicitações. São cadastradas pela equipe direto no banco. |
| `Servicos` | O catálogo: universidade, categoria, descrições, modalidade, local, status (Ativo, Sem vagas, Pausado), previsão de retorno e data de cadastro. |
| `PacoteServicos` | Quais serviços cada pacote inclui. |
| `Empresas` | Empresas clientes: CNPJ, responsável, domínio dos e-mails, pacote, vagas contratadas, status do contrato e vigência. |
| `Usuarios` | Todos os perfis (colaborador, empresa e admin). Os colaboradores convidados também ficam aqui, com o token e a data do convite. |
| `Solicitacoes` | Pedidos de atendimento dos colaboradores, com status e datas. A mensagem é só para a universidade. |
| `Propostas` | Pedidos enviados pelo formulário da landing. |

## Regras que o banco garante

- Os campos fixos (status, perfil, modalidade) só aceitam os valores combinados (CHECK).
- CNPJ e código do pacote não se repetem.
- O e-mail não se repete entre usuários não removidos.
- Um colaborador não pode ter duas solicitações abertas (Enviada ou Em contato) do mesmo serviço (índice único filtrado `UX_Solicitacoes_AbertaPorServico`).
- O admin não tem empresa; colaborador e empresa sempre têm.
- A previsão de retorno só existe em serviço Pausado.
- A proposta só é gravada com o aceite da privacidade.

## Valores calculados (não ficam em coluna)

| Valor | Regra |
|---|---|
| Selo "Novo" do serviço | `CriadoEm` há até 30 dias. |
| "Convite expirado" | Status `Convidado` e `ConviteEnviadoEm` há mais de 7 dias. |
| Vagas ocupadas | Colaboradores da empresa com `RemovidoEm` vazio. |
| Atendimentos do mês | Solicitações do usuário criadas no mês atual, menos as canceladas. |
| `temMensagem` (admin) | Se a coluna `Mensagem` tem texto. O admin nunca recebe o texto. |

Exemplos prontos de cada um estão no `03_consultas_exemplo.sql`.

## Diagrama das tabelas

```
 Pacotes ──< PacoteServicos >── Servicos >── Categorias
    │                              │
    │                              └──────> Universidades
    │                              │
    └──< Empresas ──< Usuarios ──< Solicitacoes >── (Servicos)

 Propostas (sozinha, sem ligação)

 Legenda:  A ──< B   um A tem vários B
```

Colunas de ligação:

```
PacoteServicos.PacoteId   -> Pacotes.Id
PacoteServicos.ServicoId  -> Servicos.Id
Servicos.CategoriaId      -> Categorias.Id
Servicos.UniversidadeId   -> Universidades.Id
Empresas.PacoteId         -> Pacotes.Id
Usuarios.EmpresaId        -> Empresas.Id   (vazio para o admin)
Solicitacoes.UsuarioId    -> Usuarios.Id
Solicitacoes.ServicoId    -> Servicos.Id
```

## Usuários de teste

| E-mail | Perfil |
|---|---|
| `colaborador@teste.entrenos` | colaborador |
| `empresa@teste.entrenos` | empresa |
| `admin@teste.entrenos` | admin |

O `02` cria os três com `SenhaHash` vazia. O `04_senhas_teste.sql` grava neles a senha fictícia **teste123**, já em forma de hash, gerada pelo mesmo `PasswordHasher<Usuario>` que o login usa. Os outros colaboradores dos dados de exemplo continuam sem senha e não conseguem entrar.

## Chave do JWT (uma vez por máquina)

O login devolve um token (JWT) assinado com uma chave secreta. A API não inicia sem ela e mostra um aviso com o comando. A chave nunca vai para o repositório: cada pessoa grava a sua nos **User Secrets**, um arquivo de configuração que fica na própria máquina, fora da pasta do projeto. A connection string do banco fica no mesmo lugar.

No Git Bash, dentro da pasta `backend/EntreNos.Api`:

```
dotnet user-secrets set "Jwt:Chave" "$(head -c 48 /dev/urandom | base64 -w0)"
```

Esse comando gera um texto aleatório e o grava como chave. Também dá para gravar qualquer texto seu, com 32 caracteres ou mais:

```
dotnet user-secrets set "Jwt:Chave" "<texto aleatório com 32 caracteres ou mais>"
```

Para conferir se a chave foi gravada, rode `dotnet user-secrets list`. O comando mostra os valores, então não copie a saída para nenhum lugar.

Cada máquina tem uma chave diferente. Por isso um token gerado na API de uma pessoa não funciona na API de outra. No Azure, a chave vai nas configurações do App Service, com o nome `Jwt__Chave` (dois sublinhados no lugar do `:`).

## Diferenças entre a API e o banco

- Os ids da API nos mocks são textos (`emp-1`, `serv-4`); no banco são números (`1`, `4`). O pacote é a exceção: a API usa o `Codigo` (`essencial`, `completo`).
- A API devolve a categoria pelo nome; o banco guarda `CategoriaId`.
- A API usa `local: ""` quando não há local; o banco guarda `NULL`.
- A API devolve datas no formato `AAAA-MM-DD`; o banco guarda data e hora em UTC.

## Para o back-end

- **Horário:** as datas são gravadas em UTC (`SYSUTCDATETIME()`), mas as regras de mês e de prazo usam o horário de Brasília: a contagem de atendimentos do mês (renova no dia 1º à meia-noite de Brasília), o selo "Novo" (30 dias) e o convite expirado (7 dias). Converta com `AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'` antes de comparar, como no `03_consultas_exemplo.sql`.
- **Usuários de teste:** o login só funciona depois de rodar o `04_senhas_teste.sql`, que grava em `SenhaHash` o hash de "teste123" (gerado pelo `PasswordHasher<Usuario>`).
- **`SET QUOTED_IDENTIFIER ON`:** é necessário por causa dos índices filtrados (`UX_Usuarios_Email`, `UX_Usuarios_TokenConvite` e `UX_Solicitacoes_AbertaPorServico`). Sem ele, o SQL Server recusa criar os índices e também gravar nas tabelas Usuarios e Solicitacoes. Os scripts já ligam a opção; o SSMS e o driver do .NET também vêm com ela ligada.
- **Limites de texto:** a mensagem da proposta tem até 1000 caracteres e a da solicitação até 300. O back-end deve validar e devolver erro 400 antes de gravar.
