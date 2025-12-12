using System.Net;

public class CurrencyClient : ICurrencyClient
{
    private readonly HttpClient _http;
    public CurrencyClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<ConversionResult?> ConvertAsync(string from, string to, decimal amount)
    {
        var url = $"/convert?from={WebUtility.UrlEncode(from)}&to={WebUtility.UrlEncode(to)}&amount={amount}";
        var response = await _http.GetAsync(url);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ConversionResult>();
    }
}