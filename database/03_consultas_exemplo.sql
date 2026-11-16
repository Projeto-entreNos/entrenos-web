SET NOCOUNT ON;

DECLARE @EmpresaId INT = 1;
DECLARE @UsuarioId INT = 1;

DECLARE @HojeBrasilia DATE = CAST(SYSUTCDATETIME() AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' AS DATE);
DECLARE @InicioDoMesBrasilia DATE = DATEFROMPARTS(YEAR(@HojeBrasilia), MONTH(@HojeBrasilia), 1);


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

SELECT COUNT(*) AS Usados
FROM Solicitacoes
WHERE UsuarioId = @UsuarioId
  AND Status <> N'Cancelada'
  AND CAST(CriadaEm AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time' AS DATE) >= @InicioDoMesBrasilia;

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
