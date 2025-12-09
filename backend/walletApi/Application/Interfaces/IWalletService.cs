public interface IWalletService
{
    // Task<CurrencyDTO> RegisterCurrency(CurrencyDTO currencyDto);
    // Task<CurrencyDTO?> GetCurrencyDetails(int id);
    // Task<CurrencyDTO[]> GetAllCurrencies();
    // Task<CurrencyDTO?> UpdateCurrency(int id, CurrencyDTO currencytDTO);
    // Task DeleteCurrency(int id);
    // Task<Currency?> GetCurrencyById(int id);
    // Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol);
    // Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync();
    // Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity);

    Task<Wallet> CreateWalletAsync(Wallet wallet);
    Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount);
    Task<IEnumerable<Wallet>> GetAllWalletsAsync();
    Task<Wallet> GetWalletByIdAsync(int id);
    Task<IEnumerable<Wallet>> GetWalletsByUserIdAsync(int userId);
}