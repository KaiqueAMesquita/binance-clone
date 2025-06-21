using CurrencyAPI.API.DTOs;

public interface ICurrencyRepository
{
    Task Add(Currency currency);
    Task<Currency?> GetById(int id);
    Task<IEnumerable<Currency?>> ListAll();
    Task Update(Currency currency);
    Task Delete(Currency currency);
    Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol);
    Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync();
    Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity);
}