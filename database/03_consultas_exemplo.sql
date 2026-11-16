/*
  EntreNós: consultas de exemplo para o back-end.
  Troque os valores das variáveis para testar com outros ids.
  As datas são gravadas em UTC (SYSUTCDATETIME), mas as regras de mês e de prazo
  usam o horário de Brasília: um pedido feito às 22h do dia 31 (Brasília) já é dia 1º
  em UTC e não pode contar no mês seguinte. Por isso as datas são convertidas com
  AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' antes de comparar.
*/

SET NOCOUNT ON;

DECLARE @EmpresaId INT = 1;
DECLARE @UsuarioId INT = 1;

DECLARE @HojeBrasilia DATE = CAST(SYSUTCDATETIME() AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' AS DATE);
DECLARE @InicioDoMesBrasilia DATE = DATEFROMPARTS(YEAR(@HojeBrasilia), MONTH(@HojeBrasilia), 1);


-- 1. Serviços do pacote de uma empresa (GET /empresas/:empresaId/servicos)
-- "Novo": serviço criado há até 30 dias, contando pela data de Brasília
SELECT
    Servicos.Id,
    Servicos.Nome,
    Categorias.Nome AS Categoria,
    Servicos.DescricaoCurta,
    Servicos.Modalidade,
    Servicos.Local,
    Servicos.Status,
    Servicos.PrevisaoRetorno,
    CAST(CASE
        WHEN CAST(Servicos.CriadoEm AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' AS DATE)
             >= DATEADD(DAY, -30, @HojeBrasilia) THEN 1
        ELSE 0
    END AS BIT) AS Novo,
    Universidades.Id AS UniversidadeId,
    Universidades.Nome AS UniversidadeNome
FROM Empresas
JOIN PacoteServicos ON PacoteServicos.PacoteId = Empresas.PacoteId
JOIN Servicos ON Servicos.Id = PacoteServicos.ServicoId
JOIN Categorias ON Categorias.Id = Servicos.CategoriaId
JOIN Universidades ON Universidades.Id = Servicos.UniversidadeId
WHERE Empresas.Id = @EmpresaId
ORDER BY Categorias.Ordem, Servicos.Nome;


-- 2. Atendimentos do mês de um usuário (GET /usuarios/:usuarioId/atendimentos-do-mes)
-- Contam as solicitações criadas no mês atual, menos as canceladas.
-- O limite renova no dia 1º, à meia-noite de Brasília.
SELECT COUNT(*) AS Usados
FROM Solicitacoes
WHERE UsuarioId = @UsuarioId
  AND Status <> N'Cancelada'
  AND CAST(CriadaEm AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' AS DATE) >= @InicioDoMesBrasilia;


-- 3. Solicitações para o admin (GET /admin/solicitacoes)
-- LGPD: nunca selecionar a coluna Mensagem aqui, só se ela existe (TemMensagem)
SELECT
    Solicitacoes.Id,
    Solicitacoes.Status,
    Solicitacoes.CriadaEm,
    Solicitacoes.AtualizadaEm,
    Solicitacoes.AtendidaEm,
    CAST(CASE WHEN Solicitacoes.Mensagem IS NOT NULL AND Solicitacoes.Mensagem <> N'' THEN 1 ELSE 0 END AS BIT) AS TemMensagem,
    Usuarios.Nome AS ColaboradorNome,
    Usuarios.Email AS ColaboradorEmail,
    Empresas.Id AS EmpresaId,
    Empresas.Nome AS EmpresaNome,
    Servicos.Nome AS ServicoNome,
    Universidades.Id AS UniversidadeId,
    Universidades.Nome AS UniversidadeNome,
    Universidades.EmailContato AS UniversidadeEmail
FROM Solicitacoes
JOIN Usuarios ON Usuarios.Id = Solicitacoes.UsuarioId
JOIN Empresas ON Empresas.Id = Usuarios.EmpresaId
JOIN Servicos ON Servicos.Id = Solicitacoes.ServicoId
JOIN Universidades ON Universidades.Id = Servicos.UniversidadeId
ORDER BY Solicitacoes.CriadaEm DESC;


-- 4. Colaboradores de uma empresa (GET /empresas/:empresaId/colaboradores)
-- "Convite expirado": ainda Convidado e já passaram os 7 dias de validade do convite.
-- O convite vale até o fim do 7º dia depois do envio, pela data de Brasília.
SELECT
    Id,
    Nome,
    Email,
    CASE
        WHEN Status = N'Convidado'
             AND DATEADD(DAY, 7, CAST(ConviteEnviadoEm AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' AS DATE))
                 < @HojeBrasilia THEN N'Convite expirado'
        ELSE Status
    END AS Status,
    ConviteEnviadoEm
FROM Usuarios
WHERE EmpresaId = @EmpresaId
  AND Perfil = N'colaborador'
  AND RemovidoEm IS NULL
ORDER BY ConviteEnviadoEm DESC;


-- 5. Vagas ocupadas de uma empresa
-- Cada colaborador não removido ocupa uma vaga: Convidado, Convite expirado ou Ativo
SELECT
    Empresas.VagasContratadas,
    COUNT(Usuarios.Id) AS VagasOcupadas
FROM Empresas
LEFT JOIN Usuarios
    ON Usuarios.EmpresaId = Empresas.Id
   AND Usuarios.Perfil = N'colaborador'
   AND Usuarios.RemovidoEm IS NULL
WHERE Empresas.Id = @EmpresaId
GROUP BY Empresas.VagasContratadas;
