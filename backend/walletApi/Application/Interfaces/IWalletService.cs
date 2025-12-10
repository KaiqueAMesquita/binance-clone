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

    Task<WalletDTO> RegisterWalletAsync(WalletDTO walletDto);
    Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount);
    Task<IEnumerable<Wallet?>> GetAllAsync();
    Task<Wallet?> GetWalletDetailsAsync(int id);
    Task<IEnumerable<Wallet?>> ListAllByUserIdAsync(int userId);
}