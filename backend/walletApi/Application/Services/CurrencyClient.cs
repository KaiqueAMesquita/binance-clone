using System.Net;
using System.Net.Http.Json; 
using System.Threading.Tasks;

public class CurrencyClient : ICurrencyClient
{
    private readonly HttpClient _http;
    
    public CurrencyClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<ConversionResult?> ConvertAsync(string from, string to, decimal amount)
    {
        // O HttpClient já tem "http://localhost:5237" na base.
        // Nós adicionamos o resto: "api/Currency/convert..."
        var url = $"api/Currency/convert?from={WebUtility.UrlEncode(from)}&to={WebUtility.UrlEncode(to)}&amount={amount}";
        
        // Faz a chamada
        var response = await _http.GetAsync(url);
        
        // Se der erro aqui, é porque a URL montada ficou errada ou a CurrencyApi está desligada
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<ConversionResult>();
    }
}