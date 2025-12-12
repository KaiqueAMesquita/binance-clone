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
        // O HttpClient já tem "http://localhost:5237" na base.
        // Nós adicionamos o resto: "api/Currency/convert..."
        var url = $"api/Currency/convert?from={WebUtility.UrlEncode(from)}&to={WebUtility.UrlEncode(to)}&amount={amount}";
        
        // Faz a chamada
        var response = await _http.GetAsync(url);
        if (!response.IsSuccessStatusCode) 
            throw new Exception($"Erro HTTP {response.StatusCode} ao buscar cotação.");
        
        // Se der erro aqui, é porque a URL montada ficou errada ou a CurrencyApi está desligada
        // response.EnsureSuccessStatusCode();
        
        // var json = await response.Content.ReadAsStringAsync();
        // var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        // var currencies = JsonSerializer.Deserialize<List<CurrencyResponse>>(json, options);

        // var currencyFrom = currencies?.FirstOrDefault(c => c.Symbol.Equals(from, StringComparison.OrdinalIgnoreCase));
        // var currencyTo = currencies?.FirstOrDefault(c => c.Symbol.Equals(to, StringComparison.OrdinalIgnoreCase));

        // try
        // {
        //     var json = await response.Content.ReadAsStringAsync();
        //     Console.WriteLine($"[DEBUG] Currency API Response: {json}");
            
        //     var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        //     return JsonSerializer.Deserialize<ConversionResult>(json, options);
        // }
        // catch (JsonException ex)
        // {
        //     Console.WriteLine($"[ERROR] JSON deserialization failed: {ex.Message}");
        //     throw new InvalidOperationException($"Failed to deserialize Currency API response: {ex.Message}", ex);
        // }
        
        return await response.Content.ReadFromJsonAsync<ConversionResult>();
    }

    private class CurrencyResponse { public string Symbol { get; set; } public List<HistoryResponse> Histories { get; set; } }
    private class HistoryResponse { public decimal Value { get; set; } public DateTime Date { get; set; } }
}