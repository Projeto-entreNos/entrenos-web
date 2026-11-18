/*
  Senha FICTÍCIA "teste123" para os 3 usuários de teste, um por perfil.
  Rode depois do 02_dados_iniciais.sql. Só para bancos de teste: nunca em produção.
  Os hashes foram gerados pelo PasswordHasher<Usuario> do ASP.NET Core, o mesmo usado no login.
  Cada um tem um "sal" aleatório, por isso os três são diferentes mesmo com a mesma senha.
*/
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

UPDATE Usuarios SET SenhaHash = N'AQAAAAIAAYagAAAAELjWZaO/Tkt1XrtPNR7cpeQ1vsQZuX/t0nJMOhyMn5N0oK1CxMUoAwzMcGG59r2x9Q=='
WHERE Email = N'colaborador@teste.entrenos';

UPDATE Usuarios SET SenhaHash = N'AQAAAAIAAYagAAAAEKEAIN+2pbx8xMgoyT/v5WrDNZ9QD+fqFS2BohZDhqdVoiBNZFB6eAW7RtF1bUbn2A=='
WHERE Email = N'empresa@teste.entrenos';

UPDATE Usuarios SET SenhaHash = N'AQAAAAIAAYagAAAAEOptWRiuFrfIvjLX5s9+K7ib6OLwPXc5RukniOvBCqH0bfU1s+k33SF0G2X+bkzRgA=='
WHERE Email = N'admin@teste.entrenos';

SELECT Email, Perfil, CASE WHEN SenhaHash IS NULL THEN N'sem senha' ELSE N'com senha' END AS Senha
FROM Usuarios
WHERE Email LIKE N'%@teste.entrenos';
