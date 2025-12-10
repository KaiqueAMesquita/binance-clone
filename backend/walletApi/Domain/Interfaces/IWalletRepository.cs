public interface IWalletRepository
{
    Task<Wallet> AddAsync(Wallet wallet);
    Task UpdateAsync(Wallet wallet);
    Task DeleteAsync(Wallet wallet);
    Task<IEnumerable<Wallet?>> ListAllAsync();
    Task<Wallet?> GetByIdAsync(int id);
    Task<IEnumerable<Wallet?>> ListAllByUserIdAsync(int userId);
    Task<Wallet?> GetByUserAndCurrencyAsync(int userId, string currency);

    // Task Add(Currency currency);
    // Task<Currency?> GetById(int id);
    // Task<IEnumerable<Currency?>> ListAll();
    // Task Update(Currency currency);
    // Task Delete(Currency currency);
    // Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol);
    // Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync();
    // Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity);
}