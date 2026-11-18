namespace EntreNos.Api.Services;

// O que um Service devolve para o Controller: o código HTTP e o corpo da resposta
public class Resultado
{
    public int Status { get; set; }
    public object? Corpo { get; set; }

    public static Resultado Sucesso(int status, object corpo)
    {
        return new Resultado { Status = status, Corpo = corpo };
    }

    public static Resultado Erro(int status, string mensagem)
    {
        return new Resultado { Status = status, Corpo = new { mensagem } };
    }
}
