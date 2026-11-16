namespace EntreNos.Api.Services;

public interface IEnvioEmail
{
    Task Enviar(string para, string assunto, string corpo);
}

// MVP: só registra no log. O corpo nunca vai para o log,
// porque tem a mensagem do colaborador (LGPD).
public class EnvioEmailLog : IEnvioEmail
{
    private readonly ILogger<EnvioEmailLog> _log;

    public EnvioEmailLog(ILogger<EnvioEmailLog> log)
    {
        _log = log;
    }

    public Task Enviar(string para, string assunto, string corpo)
    {
        _log.LogInformation("E-mail para {Para} | assunto: {Assunto} | data: {Data:O}",
            para, assunto, DateTime.UtcNow);
        return Task.CompletedTask;
    }
}