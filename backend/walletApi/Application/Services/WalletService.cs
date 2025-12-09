public class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepository;

    public WalletService(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    // public async Task<CurrencyDTO> RegisterCurrency(CurrencyDTO currencyDto)
    // {
    //     var currency = new Currency
    //     {
    //         Symbol = currencyDto.Symbol,
    //         Name = currencyDto.Name,
    //         Description = currencyDto.Description,
    //         Backing = currencyDto.Backing,
    //     };
    //     await _currencyRepository.Add(currency);

    //     return new CurrencyDTO
    //     {
    //         Symbol = currency.Symbol,
    //         Name = currency.Name,
    //         Description = currency.Description,
    //         Backing = currency.Backing,
    //     };
    // }

    // public async Task<CurrencyDTO?> GetCurrencyDetails(int id)
    // {
    //     var currency = await _currencyRepository.GetById(id);
    //     return currency != null ? new CurrencyDTO
    //     {
    //         Id = currency.Id,
    //         Symbol = currency.Symbol,
    //         Name = currency.Name,
    //         Description = currency.Description,
    //         Backing = currency.Backing,
    //         Histories = (currency.Histories ?? new List<History>()).
    //         Select(h => new HistoryDTO
    //         {
    //             Id = h.Id,
    //             Datetime = h.Datetime,
    //             Price = h.Price,
    //             CurrencyId = h.CurrencyId
    //         }).ToList()
    //     } : null;
    // }

    // public async Task<CurrencyDTO[]> GetAllCurrencies()
    // {
    //     var currencies = await _currencyRepository.ListAll();
    //     var currencyDTOs = new List<CurrencyDTO>();

    //     foreach (var currency in currencies)
    //     {
    //         currencyDTOs.Add(new CurrencyDTO
    //         {
    //             Id = currency.Id,
    //             Symbol = currency.Symbol,
    //             Name = currency.Name,
    //             Description = currency.Description,
    //             Backing = currency.Backing,
    //             Histories = (currency.Histories ?? new List<History>()).
    //                 Select(h => new HistoryDTO
    //                 {
    //                     Id = h.Id,
    //                     Datetime = h.Datetime,
    //                     Price = h.Price,
    //                     CurrencyId = h.CurrencyId
    //                 }).ToList()
    //         });
    //     }

    //     return currencyDTOs.ToArray();
    // }

    // public async Task<CurrencyDTO?> UpdateCurrency(int id, CurrencyDTO currencyDto)
    // {

    //     var currency = await _currencyRepository.GetById(id);
    //     if (currency == null)
    //     {
    //         return null;
    //     }

    //     currency.Symbol = currencyDto.Symbol;
    //     currency.Name = currencyDto.Name;
    //     currency.Description = currencyDto.Description;
    //     currency.Backing = currencyDto.Backing;
    //     await _currencyRepository.Update(currency);


    //     return new CurrencyDTO
    //     {
    //         Symbol = currency.Symbol,
    //         Name = currency.Name,
    //         Description = currency.Description,
    //         Backing = currency.Backing,

    //     };
    // }

    // public async Task DeleteCurrency(int id)
    // {
    //     var currency = await _currencyRepository.GetById(id);
    //     await _currencyRepository.Delete(currency);
    // }

    // // Retorna Entity Currency para usar no HistoryService
    // public async Task<Currency?> GetCurrencyById(int id)
    // {
    //     var currency = await _currencyRepository.GetById(id);
    //     if (currency == null)
    //     {
    //         return null;
    //     }
    //     return currency;

    // } 

    // public async Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol)
    // {
    //     return await _currencyRepository.GetLastPriceBySymbolAsync(symbol);
    // }

    // public async Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync()
    // {
    //     return await _currencyRepository.GetCurrencySummariesAsync();
    // }

    // public async Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity)
    // {
    //     return await _currencyRepository.GetChartDataAsync(currencyId, quantity);
    // }

    public async Task<Wallet> CreateWalletAsync(Wallet wallet)
    {
        var existingWallet = await _walletRepository.GetWalletByUserAndCurrencyAsync(wallet.UserId, wallet.Currency);
        if (existingWallet != null)
            throw new InvalidOperationException("Wallet already exists for this user and currency");
            
        return await _walletRepository.CreateWalletAsync(wallet);
    }

    public async Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount)
    {
        var wallet = await _walletRepository.GetWalletByIdAsync(walletId);
        if (wallet == null)
            return false;
            
        wallet.Balance += amount;
        if (wallet.Balance < 0)
            throw new InvalidOperationException("Insufficient funds");
            
        await _walletRepository.UpdateWalletAsync(wallet);
        return true;
    }

    public async Task<IEnumerable<Wallet>> GetAllWalletsAsync()
    {
        return await _walletRepository.GetAllWalletsAsync();
    }
    
    public async Task<Wallet> GetWalletByIdAsync(int id)
    {
        return await _walletRepository.GetWalletByIdAsync(id);
    }
    
    public async Task<IEnumerable<Wallet>> GetWalletsByUserIdAsync(int userId)
    {
        return await _walletRepository.GetWalletsByUserIdAsync(userId);
    }
}