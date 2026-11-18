namespace EntreNos.Api.Services;

public interface IEnvioEmail
{
    Task Enviar(string para, string assunto, string corpo);
}

// MVP: só registra no log que um e-mail saiu. O destinatário e o corpo nunca vão
// para o log, porque têm dados pessoais e a mensagem do colaborador (LGPD).
public class EnvioEmailLog : IEnvioEmail
{
    private readonly ILogger<EnvioEmailLog> _log;

    public EnvioEmailLog(ILogger<EnvioEmailLog> log)
    {
        _log = log;
    }

    public Task Enviar(string para, string assunto, string corpo)
    {
        _log.LogInformation("E-mail enviado | assunto: {Assunto} | data: {Data:O}",
            assunto, DateTime.UtcNow);
        return Task.CompletedTask;
    }
}