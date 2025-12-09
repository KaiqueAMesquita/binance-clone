public interface IWalletRepository
{
    Task<Wallet> CreateWalletAsync(Wallet wallet);
    Task UpdateWalletAsync(Wallet wallet);
    Task<IEnumerable<Wallet>> GetAllWalletsAsync();
    Task<Wallet> GetWalletByIdAsync(int id);
    Task<IEnumerable<Wallet>> GetWalletsByUserIdAsync(int userId);
    Task<Wallet> GetWalletByUserAndCurrencyAsync(int userId, string currency);
    Task<bool> WalletExistsAsync(int id);

    // Task Add(Currency currency);
    // Task<Currency?> GetById(int id);
    // Task<IEnumerable<Currency?>> ListAll();
    // Task Update(Currency currency);
    // Task Delete(Currency currency);
    // Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol);
    // Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync();
    // Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity);
}