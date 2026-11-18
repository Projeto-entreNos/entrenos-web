namespace EntreNos.Api.Utils;

// O banco grava tudo em UTC, mas as regras de dia e de mês seguem o horário de Brasília
public static class Datas
{
    private static readonly TimeZoneInfo FusoBrasilia = TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo");

    public static DateTime ParaBrasilia(DateTime dataUtc)
    {
        var utc = DateTime.SpecifyKind(dataUtc, DateTimeKind.Utc);
        return TimeZoneInfo.ConvertTimeFromUtc(utc, FusoBrasilia);
    }

    public static DateOnly DiaEmBrasilia(DateTime dataUtc)
    {
        return DateOnly.FromDateTime(ParaBrasilia(dataUtc));
    }

    public static DateOnly HojeEmBrasilia()
    {
        return DiaEmBrasilia(DateTime.UtcNow);
    }

    // Formato "AAAA-MM-DD" que o front usa
    public static string FormatarDia(DateTime dataUtc)
    {
        return DiaEmBrasilia(dataUtc).ToString("yyyy-MM-dd");
    }

    public static string? FormatarDia(DateTime? dataUtc)
    {
        if (dataUtc == null)
        {
            return null;
        }
        return FormatarDia(dataUtc.Value);
    }

    public static string? FormatarDia(DateOnly? dia)
    {
        return dia?.ToString("yyyy-MM-dd");
    }

    // Meia-noite do dia 1º do mês atual em Brasília, convertida para UTC (para comparar com o banco)
    public static DateTime InicioDoMesEmUtc()
    {
        var hoje = HojeEmBrasilia();
        var inicioEmBrasilia = new DateTime(hoje.Year, hoje.Month, 1);
        return TimeZoneInfo.ConvertTimeToUtc(inicioEmBrasilia, FusoBrasilia);
    }
}
