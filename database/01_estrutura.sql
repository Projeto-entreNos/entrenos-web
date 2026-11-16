/*
  EntreNós: estrutura do banco (SQL Server).
  Pode ser rodado mais de uma vez: apaga as tabelas e cria de novo (os dados são perdidos).
*/

SET NOCOUNT ON;
-- Obrigatórias para os índices filtrados (no SSMS já vêm ligadas; no sqlcmd, não)
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

DROP TABLE IF EXISTS Solicitacoes;
DROP TABLE IF EXISTS Propostas;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS PacoteServicos;
DROP TABLE IF EXISTS Servicos;
DROP TABLE IF EXISTS Empresas;
DROP TABLE IF EXISTS Pacotes;
DROP TABLE IF EXISTS Categorias;
DROP TABLE IF EXISTS Universidades;
GO

CREATE TABLE Pacotes (
    Id                    INT IDENTITY(1,1) NOT NULL,
    Codigo                NVARCHAR(20)   NOT NULL,
    Nome                  NVARCHAR(50)   NOT NULL,
    Descricao             NVARCHAR(200)  NOT NULL,
    -- Um benefício por linha, na ordem em que aparecem na landing
    Beneficios            NVARCHAR(1000) NOT NULL,
    -- Em reais, por colaborador, por mês
    PrecoPorColaborador   DECIMAL(10,2)  NOT NULL,
    -- Por colaborador; o limite renova no dia 1º de cada mês
    LimiteAtendimentosMes INT            NOT NULL,
    CONSTRAINT PK_Pacotes PRIMARY KEY (Id),
    CONSTRAINT UQ_Pacotes_Codigo UNIQUE (Codigo),
    CONSTRAINT CK_Pacotes_Codigo CHECK (Codigo IN (N'essencial', N'completo')),
    CONSTRAINT CK_Pacotes_Preco CHECK (PrecoPorColaborador > 0),
    CONSTRAINT CK_Pacotes_Limite CHECK (LimiteAtendimentosMes > 0)
);

CREATE TABLE Categorias (
    Id    INT IDENTITY(1,1) NOT NULL,
    Nome  NVARCHAR(60) NOT NULL,
    Ordem INT          NOT NULL,
    CONSTRAINT PK_Categorias PRIMARY KEY (Id),
    CONSTRAINT UQ_Categorias_Nome UNIQUE (Nome)
);

-- A universidade não tem login: recebe as solicitações no EmailContato
CREATE TABLE Universidades (
    Id           INT IDENTITY(1,1) NOT NULL,
    Nome         NVARCHAR(120) NOT NULL,
    EmailContato NVARCHAR(254) NOT NULL,
    CONSTRAINT PK_Universidades PRIMARY KEY (Id)
);

CREATE TABLE Servicos (
    Id                INT IDENTITY(1,1) NOT NULL,
    Nome              NVARCHAR(120)  NOT NULL,
    UniversidadeId    INT            NOT NULL,
    CategoriaId       INT            NOT NULL,
    DescricaoCurta    NVARCHAR(200)  NULL,
    DescricaoCompleta NVARCHAR(1000) NULL,
    Modalidade        NVARCHAR(20)   NULL,
    Local             NVARCHAR(60)   NULL,
    -- Só serviços "Ativo" podem ser solicitados
    Status            NVARCHAR(20)   NOT NULL CONSTRAINT DF_Servicos_Status DEFAULT N'Ativo',
    PrevisaoRetorno   DATE           NULL,
    -- O selo "Novo" é calculado: serviço criado há até 30 dias
    CriadoEm          DATETIME2      NOT NULL CONSTRAINT DF_Servicos_CriadoEm DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Servicos PRIMARY KEY (Id),
    CONSTRAINT FK_Servicos_Universidades FOREIGN KEY (UniversidadeId) REFERENCES Universidades (Id),
    CONSTRAINT FK_Servicos_Categorias FOREIGN KEY (CategoriaId) REFERENCES Categorias (Id),
    CONSTRAINT CK_Servicos_Status CHECK (Status IN (N'Ativo', N'Sem vagas', N'Pausado')),
    CONSTRAINT CK_Servicos_Modalidade CHECK (Modalidade IN (N'Presencial', N'Online', N'Híbrido')),
    -- A previsão de retorno só vale para serviço pausado
    CONSTRAINT CK_Servicos_PrevisaoRetorno CHECK (PrevisaoRetorno IS NULL OR Status = N'Pausado')
);

CREATE TABLE PacoteServicos (
    PacoteId  INT NOT NULL,
    ServicoId INT NOT NULL,
    CONSTRAINT PK_PacoteServicos PRIMARY KEY (PacoteId, ServicoId),
    CONSTRAINT FK_PacoteServicos_Pacotes FOREIGN KEY (PacoteId) REFERENCES Pacotes (Id),
    CONSTRAINT FK_PacoteServicos_Servicos FOREIGN KEY (ServicoId) REFERENCES Servicos (Id) ON DELETE CASCADE
);

CREATE TABLE Empresas (
    Id               INT IDENTITY(1,1) NOT NULL,
    Nome             NVARCHAR(150) NOT NULL,
    -- Formato 00.000.000/0000-00
    Cnpj             NVARCHAR(18)  NOT NULL,
    Responsavel      NVARCHAR(120) NOT NULL,
    EmailResponsavel NVARCHAR(254) NOT NULL,
    -- Domínio dos e-mails da empresa, usado no aviso ao convidar alguém de outro domínio
    DominioEmail     NVARCHAR(100) NOT NULL,
    PacoteId         INT           NOT NULL,
    -- Cada colaborador convidado ocupa uma vaga; não é possível convidar acima deste número
    VagasContratadas INT           NOT NULL,
    -- Contrato e pagamento acontecem fora do sistema; o admin registra o resultado.
    -- Só "Ativo" permite convidar colaboradores.
    StatusContrato   NVARCHAR(30)  NOT NULL CONSTRAINT DF_Empresas_StatusContrato DEFAULT N'Proposta enviada',
    VigenciaInicio   DATE          NOT NULL,
    VigenciaFim      DATE          NOT NULL,
    CriadaEm         DATETIME2     NOT NULL CONSTRAINT DF_Empresas_CriadaEm DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Empresas PRIMARY KEY (Id),
    CONSTRAINT UQ_Empresas_Cnpj UNIQUE (Cnpj),
    CONSTRAINT FK_Empresas_Pacotes FOREIGN KEY (PacoteId) REFERENCES Pacotes (Id),
    CONSTRAINT CK_Empresas_StatusContrato CHECK (StatusContrato IN (N'Proposta enviada', N'Aguardando pagamento', N'Ativo', N'Encerrado')),
    CONSTRAINT CK_Empresas_Vagas CHECK (VagasContratadas > 0),
    CONSTRAINT CK_Empresas_Vigencia CHECK (VigenciaFim > VigenciaInicio)
);

/*
  Usuários dos três perfis. Os colaboradores convidados também ficam aqui.
  "Convite expirado" não é guardado: é Status "Convidado" com ConviteEnviadoEm há mais de 7 dias.
  Remover um colaborador não apaga a linha: preenche RemovidoEm (libera a vaga).
*/
CREATE TABLE Usuarios (
    Id               INT IDENTITY(1,1) NOT NULL,
    -- O convite pode ser feito só com o e-mail; o nome fica vazio até a ativação
    Nome             NVARCHAR(120) NOT NULL CONSTRAINT DF_Usuarios_Nome DEFAULT N'',
    Email            NVARCHAR(254) NOT NULL,
    -- Vazio enquanto o convidado não ativa a conta
    SenhaHash        NVARCHAR(255) NULL,
    Perfil           NVARCHAR(20)  NOT NULL,
    EmpresaId        INT           NULL,
    Status           NVARCHAR(20)  NOT NULL CONSTRAINT DF_Usuarios_Status DEFAULT N'Convidado',
    TokenConvite     NVARCHAR(100) NULL,
    ConviteEnviadoEm DATETIME2     NULL,
    AtivadoEm        DATETIME2     NULL,
    -- A ativação de conta registra o aceite dos termos
    TermosAceitosEm  DATETIME2     NULL,
    RemovidoEm       DATETIME2     NULL,
    CriadoEm         DATETIME2     NOT NULL CONSTRAINT DF_Usuarios_CriadoEm DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Usuarios PRIMARY KEY (Id),
    CONSTRAINT FK_Usuarios_Empresas FOREIGN KEY (EmpresaId) REFERENCES Empresas (Id),
    CONSTRAINT CK_Usuarios_Perfil CHECK (Perfil IN (N'colaborador', N'empresa', N'admin')),
    CONSTRAINT CK_Usuarios_Status CHECK (Status IN (N'Convidado', N'Ativo')),
    -- O admin é da equipe EntreNós e não tem empresa; os outros perfis sempre têm
    CONSTRAINT CK_Usuarios_EmpresaPorPerfil CHECK (
        (Perfil = N'admin' AND EmpresaId IS NULL) OR (Perfil <> N'admin' AND EmpresaId IS NOT NULL)
    )
);

-- O e-mail é único entre os usuários não removidos: quem foi removido pode ser convidado de novo
CREATE UNIQUE INDEX UX_Usuarios_Email ON Usuarios (Email) WHERE RemovidoEm IS NULL;

CREATE UNIQUE INDEX UX_Usuarios_TokenConvite ON Usuarios (TokenConvite) WHERE TokenConvite IS NOT NULL;

CREATE INDEX IX_Usuarios_EmpresaId ON Usuarios (EmpresaId);

/*
  LGPD: a Mensagem vai só para a universidade. O admin nunca vê o conteúdo,
  só se ela existe (temMensagem).
*/
CREATE TABLE Solicitacoes (
    Id           INT IDENTITY(1,1) NOT NULL,
    UsuarioId    INT           NOT NULL,
    ServicoId    INT           NOT NULL,
    Mensagem     NVARCHAR(300) NULL,
    Status       NVARCHAR(20)  NOT NULL CONSTRAINT DF_Solicitacoes_Status DEFAULT N'Enviada',
    CriadaEm     DATETIME2     NOT NULL CONSTRAINT DF_Solicitacoes_CriadaEm DEFAULT SYSUTCDATETIME(),
    AtualizadaEm DATETIME2     NOT NULL CONSTRAINT DF_Solicitacoes_AtualizadaEm DEFAULT SYSUTCDATETIME(),
    AtendidaEm   DATETIME2     NULL,
    CONSTRAINT PK_Solicitacoes PRIMARY KEY (Id),
    CONSTRAINT FK_Solicitacoes_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios (Id),
    CONSTRAINT FK_Solicitacoes_Servicos FOREIGN KEY (ServicoId) REFERENCES Servicos (Id),
    CONSTRAINT CK_Solicitacoes_Status CHECK (Status IN (N'Enviada', N'Em contato', N'Atendida', N'Cancelada')),
    CONSTRAINT CK_Solicitacoes_AtendidaEm CHECK (AtendidaEm IS NULL OR Status = N'Atendida')
);

-- Não é permitido solicitar de novo um serviço com solicitação "Enviada" ou "Em contato"
CREATE UNIQUE INDEX UX_Solicitacoes_AbertaPorServico
    ON Solicitacoes (UsuarioId, ServicoId)
    WHERE Status IN (N'Enviada', N'Em contato');

CREATE INDEX IX_Solicitacoes_UsuarioId_CriadaEm ON Solicitacoes (UsuarioId, CriadaEm);

-- Pedidos enviados pelo formulário da landing
CREATE TABLE Propostas (
    Id                  INT IDENTITY(1,1) NOT NULL,
    Nome                NVARCHAR(120)  NOT NULL,
    Empresa             NVARCHAR(150)  NOT NULL,
    Email               NVARCHAR(254)  NOT NULL,
    NumeroColaboradores INT            NOT NULL,
    Mensagem            NVARCHAR(1000) NULL,
    -- Sem o aceite da política de privacidade a proposta não pode ser enviada
    AceitePrivacidade   BIT            NOT NULL,
    CriadaEm            DATETIME2      NOT NULL CONSTRAINT DF_Propostas_CriadaEm DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Propostas PRIMARY KEY (Id),
    CONSTRAINT CK_Propostas_NumeroColaboradores CHECK (NumeroColaboradores >= 1),
    CONSTRAINT CK_Propostas_AceitePrivacidade CHECK (AceitePrivacidade = 1)
);
GO
