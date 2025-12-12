public interface ICurrencyClient
{
    Task<ConversionResult?> ConvertAsync(string from, string to, decimal amount);
}