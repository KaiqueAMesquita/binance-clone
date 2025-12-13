using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
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
        // O HttpClient já tem a base URL da gateway na base.
        // Tentando a rota correta através do gateway
        var url = $"/currency/convert?from={WebUtility.UrlEncode(from)}&to={WebUtility.UrlEncode(to)}&amount={amount}";
        
        // Faz a chamada
        var response = await _http.GetAsync(url);
        if (!response.IsSuccessStatusCode) 
            throw new Exception($"Erro HTTP {response.StatusCode} ao buscar cotação.");
        
        return await response.Content.ReadFromJsonAsync<ConversionResult>();
    }

    private class CurrencyResponse { public string Symbol { get; set; } public List<HistoryResponse> Histories { get; set; } }
    private class HistoryResponse { public decimal Value { get; set; } public DateTime Date { get; set; } }
}