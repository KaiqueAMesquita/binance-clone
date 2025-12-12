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
    Task<WalletDTO?> UpdateWalletAsync(int id, WalletDTO wallet);
    // Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount);
    Task<TransactionDTO> Deposit(DepositRequestDTO depositRequest);
    Task DeleteWallet(int id);
    Task<IEnumerable<WalletDTO?>> GetAllAsync();
    Task<WalletDTO?> GetWalletDetailsAsync(int id);
    Task<IEnumerable<WalletDTO?>> ListAllByUserIdAsync(int userId);
}