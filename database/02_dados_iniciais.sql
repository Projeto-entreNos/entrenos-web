
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

SET IDENTITY_INSERT Pacotes ON;
INSERT INTO Pacotes (Id, Codigo, Nome, Descricao, Beneficios, PrecoPorColaborador, LimiteAtendimentosMes) VALUES
(1, N'essencial', N'Essencial', N'Para começar a oferecer os atendimentos à equipe.',
    N'Acesso ao catálogo de serviços' + NCHAR(10) +
    N'Até 2 atendimentos por colaborador/mês' + NCHAR(10) +
    N'Agendamento com a universidade' + NCHAR(10) +
    N'Suporte por e-mail',
    29.00, 2),
(2, N'completo', N'Completo', N'Mais atendimentos por mês, gerente de conta e relatórios de uso.',
    N'Tudo do pacote Essencial' + NCHAR(10) +
    N'Até 5 atendimentos por colaborador/mês' + NCHAR(10) +
    N'Gerente de conta dedicado' + NCHAR(10) +
    N'Acompanhamento de uso pelo RH' + NCHAR(10) +
    N'Suporte prioritário por WhatsApp',
    49.00, 5);
SET IDENTITY_INSERT Pacotes OFF;

SET IDENTITY_INSERT Categorias ON;
INSERT INTO Categorias (Id, Nome, Ordem) VALUES
(1, N'Apoio contábil e financeiro', 1),
(2, N'Consultoria em gestão e negócios', 2),
(3, N'Apoio educacional e idiomas', 3),
(4, N'Capacitação em tecnologia básica', 4),
(5, N'Assessoria jurídica', 5);
SET IDENTITY_INSERT Categorias OFF;

SET IDENTITY_INSERT Universidades ON;
INSERT INTO Universidades (Id, Nome, EmailContato) VALUES
(1, N'Faculdade Horizonte', N'extensao@horizonte.exemplo.edu.br'),
(2, N'Instituto Atlântico', N'naf@atlantico.exemplo.edu.br'),
(3, N'Faculdade Ipê', N'administracao@ipe.exemplo.edu.br'),
(4, N'Faculdade Lumen', N'letras@lumen.exemplo.edu.br');
SET IDENTITY_INSERT Universidades OFF;


SET IDENTITY_INSERT Servicos ON;
INSERT INTO Servicos (Id, Nome, UniversidadeId, CategoriaId, DescricaoCurta, DescricaoCompleta, Modalidade, Local, Status, PrevisaoRetorno, CriadoEm) VALUES
(1, N'Consultoria de negócios', 3, 2,
    N'Para quem quer abrir um pequeno negócio: planejamento, marketing digital e organização de caixa.',
    N'Consultoria com estudantes de Administração, com supervisão de professores. Ajuda a tirar a ideia do papel: plano de negócio, preço de venda, divulgação nas redes e controle do caixa.',
    N'Híbrido', NULL, N'Ativo', NULL, '2026-03-02'),
(2, N'Ajuda com a declaração do Imposto de Renda', 2, 1,
    N'Orientação para preencher e enviar a declaração anual do Imposto de Renda.',
    N'Atendimento no Núcleo de Apoio Contábil e Fiscal com estudantes de Ciências Contábeis, com supervisão de professores. Explica quem precisa declarar, quais documentos separar e como evitar a malha fina.',
    N'Presencial', NULL, N'Sem vagas', NULL, '2026-03-02'),
(3, N'Conversação em inglês', 4, 3,
    N'Encontros em grupo para praticar a conversação em inglês do dia a dia e do trabalho.',
    N'Turmas pequenas, separadas por nível, conduzidas por estudantes de Letras, com supervisão de professores. Os encontros são semanais e focam em situações reais, como reuniões, e-mails e viagens.',
    N'Online', NULL, N'Ativo', NULL, DATEADD(DAY, -10, SYSUTCDATETIME())),
(4, N'Educação financeira', 2, 1,
    N'Orçamento doméstico, saída das dívidas e dúvidas fiscais básicas, com estudantes de contábeis.',
    N'Educação financeira pessoal com estudantes de ciências contábeis do NAF (Núcleo de Apoio Contábil e Fiscal), com supervisão de professores. Indicado para organizar o orçamento doméstico, planejar a saída das dívidas e tirar dúvidas fiscais básicas, como a declaração do Imposto de Renda.',
    N'Presencial', N'Núcleo de Apoio Contábil e Fiscal', N'Ativo', NULL, DATEADD(DAY, -10, SYSUTCDATETIME())),
(5, N'Formalização de MEI', 3, 2,
    N'Passo a passo para abrir um MEI, emitir nota fiscal e manter as obrigações em dia.',
    N'Orientação com estudantes de Administração, com supervisão de professores, para quem trabalha por conta própria. Explica as vantagens do MEI, como fazer o cadastro, emitir nota fiscal e pagar a guia mensal.',
    N'Online', NULL, N'Ativo', NULL, '2026-03-02'),
(6, N'Idiomas e reforço escolar', 4, 3,
    N'Oficinas de inglês e espanhol básico e reforço escolar para os filhos, com estudantes de Letras.',
    N'Oficinas de inglês e espanhol para iniciantes e reforço escolar para os filhos em português e redação. As aulas são dadas por estudantes de Letras e das licenciaturas, com supervisão de professores.',
    N'Híbrido', NULL, N'Ativo', NULL, DATEADD(DAY, -10, SYSUTCDATETIME())),
(7, N'Marketing digital para pequenos negócios', 3, 2,
    N'Como divulgar o seu negócio nas redes sociais e vender mais pela internet.',
    N'Oficina prática com estudantes de Administração, com supervisão de professores. Ensina a montar um perfil comercial, planejar postagens e atender clientes pelo WhatsApp para aumentar as vendas.',
    N'Online', NULL, N'Ativo', NULL, DATEADD(DAY, -10, SYSUTCDATETIME())),
(8, N'Reforço escolar de matemática', 4, 3,
    N'Aulas de reforço de matemática para os filhos do ensino fundamental.',
    N'Aulas em pequenos grupos com estudantes das licenciaturas, com supervisão de professores, para revisar a matéria da escola e ajudar nas tarefas de casa.',
    N'Presencial', NULL, N'Pausado', NULL, '2026-03-02'),
(9, N'Informática e planilhas', 1, 4,
    N'Primeiros passos no computador, uso de planilhas e introdução ao mundo digital.',
    N'Oficinas de informática com estudantes dos cursos de tecnologia, com supervisão de professores. Inclui uso do computador, planilhas e serviços digitais do dia a dia, como e-mail e aplicativos. Turmas pequenas, separadas por nível.',
    N'Presencial', N'Laboratório de informática', N'Sem vagas', NULL, '2026-03-02'),
(10, N'Segurança na internet', 1, 4,
    N'Como criar senhas fortes, reconhecer golpes e usar o celular e o computador com segurança.',
    N'Oficina com estudantes dos cursos de tecnologia, com supervisão de professores. Mostra como proteger contas, identificar golpes por mensagem e e-mail e fazer compras e pagamentos pela internet com segurança.',
    N'Online', NULL, N'Ativo', NULL, '2026-03-02'),
(11, N'Assessoria jurídica', 1, 5,
    N'Orientação sobre dúvidas do dia a dia, como contratos, consumo e família.',
    N'Orientação jurídica feita por estudantes do Núcleo de Prática Jurídica, com supervisão de professores. Ajuda com dúvidas do dia a dia, como contratos, direitos do consumidor e questões de família.',
    N'Híbrido', N'Online ou no Núcleo de Prática Jurídica', N'Pausado', '2027-02-01', '2026-03-02'),
(12, N'Orientação sobre direitos trabalhistas', 1, 5,
    N'Dúvidas sobre carteira assinada, férias, rescisão e outros direitos do trabalhador.',
    N'Primeira orientação sobre direito do trabalho no Núcleo de Prática Jurídica, com estudantes de Direito e supervisão de professores. Explica direitos, prazos e os caminhos possíveis em cada caso.',
    N'Híbrido', NULL, N'Ativo', NULL, '2026-03-02');
SET IDENTITY_INSERT Servicos OFF;

INSERT INTO PacoteServicos (PacoteId, ServicoId)
SELECT Pacotes.Id, Servicos.Id
FROM Pacotes
CROSS JOIN Servicos;

SET IDENTITY_INSERT Empresas ON;
INSERT INTO Empresas (Id, Nome, Cnpj, Responsavel, EmailResponsavel, DominioEmail, PacoteId, VagasContratadas, StatusContrato, VigenciaInicio, VigenciaFim) VALUES
(1, N'Alfa Exemplo Tecnologia Ltda.', N'00.000.000/0001-00', N'Bruno Exemplo', N'empresa@teste.entrenos', N'alfa.exemplo.com', 2, 10, N'Ativo', '2026-09-01', '2027-08-31'),
(2, N'Beta Exemplo Comércio S.A.', N'00.000.000/0002-00', N'Mariana Exemplo', N'mariana@beta.exemplo.com', N'beta.exemplo.com', 1, 25, N'Aguardando pagamento', '2026-12-01', '2027-11-30'),
(3, N'Gama Exemplo Serviços Ltda.', N'00.000.000/0003-00', N'Nuno Exemplo', N'nuno@gama.exemplo.com', N'gama.exemplo.com', 1, 5, N'Encerrado', '2025-06-01', '2026-05-31'),
(4, N'Delta Exemplo Indústria Ltda.', N'00.000.000/0004-00', N'Olívia Exemplo', N'olivia@delta.exemplo.com', N'delta.exemplo.com', 2, 15, N'Proposta enviada', '2027-01-01', '2027-12-31');
SET IDENTITY_INSERT Empresas OFF;

/*
  Usuários 1 a 10: colaboradores (col-1 a col-10 dos mocks). 11: empresa. 12: admin.
  Usuários de teste: colaborador@teste.entrenos, empresa@teste.entrenos e admin@teste.entrenos.
  A SenhaHash deles fica NULL: o hash de "teste123" será gerado pelo back-end,
  com o mesmo algoritmo usado no login.
  Os convites em aberto da Alfa contam a partir de hoje, para os status não mudarem com o tempo:
  Gabriela (1 dia) e Heitor (2 dias) estão válidos; Íris (10 dias) aparece como "Convite expirado".
*/
SET IDENTITY_INSERT Usuarios ON;
INSERT INTO Usuarios (Id, Nome, Email, SenhaHash, Perfil, EmpresaId, Status, TokenConvite, ConviteEnviadoEm, AtivadoEm, TermosAceitosEm) VALUES
(1,  N'Ana Exemplo',      N'colaborador@teste.entrenos', NULL, N'colaborador', 1, N'Ativo',     NULL, '2026-09-02', '2026-09-03', '2026-09-03'),
(2,  N'Diego Exemplo',    N'diego@alfa.exemplo.com',     NULL, N'colaborador', 1, N'Ativo',     NULL, '2026-09-02', '2026-09-04', '2026-09-04'),
(3,  N'Elisa Exemplo',    N'elisa@alfa.exemplo.com',     NULL, N'colaborador', 1, N'Ativo',     NULL, '2026-09-02', '2026-09-02', '2026-09-02'),
(4,  N'Fábio Exemplo',    N'fabio@alfa.exemplo.com',     NULL, N'colaborador', 1, N'Ativo',     NULL, '2026-09-10', '2026-09-12', '2026-09-12'),
(5,  N'Gabriela Exemplo', N'gabriela@alfa.exemplo.com',  NULL, N'colaborador', 1, N'Convidado', N'convite-gabriela', DATEADD(DAY, -1, SYSUTCDATETIME()), NULL, NULL),
(6,  N'Heitor Exemplo',   N'heitor@alfa.exemplo.com',    NULL, N'colaborador', 1, N'Convidado', N'convite-heitor',   DATEADD(DAY, -2, SYSUTCDATETIME()), NULL, NULL),
(7,  N'Íris Exemplo',     N'iris@alfa.exemplo.com',      NULL, N'colaborador', 1, N'Convidado', N'convite-iris',     DATEADD(DAY, -10, SYSUTCDATETIME()), NULL, NULL),
(8,  N'João Exemplo',     N'joao@gama.exemplo.com',      NULL, N'colaborador', 3, N'Ativo',     NULL, '2025-06-03', '2025-06-03', '2025-06-03'),
(9,  N'Karina Exemplo',   N'karina@gama.exemplo.com',    NULL, N'colaborador', 3, N'Ativo',     NULL, '2025-06-03', '2025-06-05', '2025-06-05'),
(10, N'Lucas Exemplo',    N'lucas@gama.exemplo.com',     NULL, N'colaborador', 3, N'Convidado', NULL, '2025-07-01', NULL, NULL),
(11, N'Bruno Exemplo',    N'empresa@teste.entrenos',     NULL, N'empresa',     1, N'Ativo',     NULL, NULL, NULL, NULL),
(12, N'Carla Exemplo',    N'admin@teste.entrenos',       NULL, N'admin',       NULL, N'Ativo',  NULL, NULL, NULL, NULL);
SET IDENTITY_INSERT Usuarios OFF;

/*
  Mensagens genéricas, sem dados pessoais (LGPD).
  A usuária de teste (1, pacote Completo, limite 5 por mês) tem 2 solicitações em novembro de 2026.
*/
SET IDENTITY_INSERT Solicitacoes ON;
INSERT INTO Solicitacoes (Id, UsuarioId, ServicoId, Mensagem, Status, CriadaEm, AtualizadaEm, AtendidaEm) VALUES
(1, 1, 1,  NULL,                       N'Em contato', '2026-11-03T10:00:00', '2026-11-04T14:00:00', NULL),
(2, 1, 4,  N'Mensagem de exemplo.',    N'Enviada',    '2026-11-06T09:30:00', '2026-11-06T09:30:00', NULL),
(3, 1, 6,  NULL,                       N'Atendida',   '2026-10-10T11:00:00', '2026-10-21T16:00:00', '2026-10-21T16:00:00'),
(4, 1, 9,  NULL,                       N'Cancelada',  '2026-10-02T08:45:00', '2026-10-03T10:00:00', NULL),
(5, 2, 7,  N'Mensagem de exemplo.',    N'Enviada',    '2026-11-05T15:20:00', '2026-11-05T15:20:00', NULL),
(6, 3, 11, N'Mensagem de exemplo.',    N'Atendida',   '2026-10-15T13:10:00', '2026-10-28T17:00:00', '2026-10-28T17:00:00'),
(7, 4, 3,  N'Mensagem de exemplo.',    N'Em contato', '2026-11-01T10:40:00', '2026-11-02T09:00:00', NULL),
(8, 8, 12, NULL,                       N'Atendida',   '2026-05-10T14:00:00', '2026-05-20T11:30:00', '2026-05-20T11:30:00');
SET IDENTITY_INSERT Solicitacoes OFF;
GO
