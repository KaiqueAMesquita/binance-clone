public class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepository;
    private readonly ITransactionService _transactionService;
    private readonly ICurrencyClient _currencyClient;

    public WalletService(IWalletRepository walletRepository, ITransactionService transactionService, ICurrencyClient currencyClient)
    {
        _walletRepository = walletRepository;
        _transactionService = transactionService;
        _currencyClient = currencyClient;
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

    public async Task<WalletDTO> RegisterWalletAsync(WalletDTO walletDto)
    {
        var wallet = new Wallet
        {
            Currency = walletDto.Currency,
            Balance = 0,
            UserId = walletDto.UserId
        };

        var existingWallet = await _walletRepository.GetByUserAndCurrencyAsync(wallet.UserId, wallet.Currency);
        if (existingWallet != null)
        {
            throw new InvalidOperationException("Wallet already exists for this user and currency");
        }
        
        await _walletRepository.AddAsync(wallet);

            
        return new WalletDTO
        {
            Currency = wallet.Currency,
            Balance = wallet.Balance,
            UserId = wallet.UserId
        };
    }

    public async Task<WalletDTO?> UpdateWalletAsync(int id, WalletDTO walletDto)
    {
        var wallet = await _walletRepository.GetByIdAsync(id);
        if(wallet == null)
            return null;

        wallet.Currency = walletDto.Currency;
        wallet.Balance = walletDto.Balance;
        wallet.UserId = walletDto.UserId;
        await _walletRepository.UpdateAsync(wallet);

        return new WalletDTO
        {
            Currency = wallet.Currency,
            Balance = wallet.Balance,
            UserId = wallet.UserId
        };
    }

    // public async Task<bool> UpdateWalletBalanceAsync(int walletId, decimal amount)
    // {
    //     var wallet = await _walletRepository.GetByIdAsync(walletId);
    //     if (wallet == null)
    //         return false;
            
    //     wallet.Balance += amount;
    //     if (wallet.Balance < 0)
    //         throw new InvalidOperationException("Insufficient funds");
            
    //     await _walletRepository.UpdateAsync(wallet);
    //     return true;
    // }

    public async Task<TransactionDTO> Deposit(DepositRequestDTO depositRequest)
    {
        var transactionDto = await _transactionService.Deposit(depositRequest);

        var receiverWallet = await _walletRepository.GetByIdAsync(transactionDto.DestinyWalletId);

        receiverWallet.Balance += transactionDto.Amount;
        await _walletRepository.UpdateAsync(receiverWallet);

        return transactionDto;
    }

    public async Task<TransactionDTO> Transfer(TransactionDTO transactionDto)
    {
        var transactioDto = await _transactionService.RegisterTransaction(transactionDto);

        var SenderWallet = await _walletRepository.GetByIdAsync(transactioDto.WalletId);
        var receiverWallet = await _walletRepository.GetByIdAsync(transactioDto.DestinyWalletId);

        if(SenderWallet.Balance < 0 || SenderWallet.Balance < transactioDto.Amount)
        {
            throw new InvalidOperationException("Insufficient funds");
        }

        var conversionValue = transactionDto.Amount;
        
        if (!string.Equals(SenderWallet.Currency, receiverWallet.Currency, StringComparison.OrdinalIgnoreCase))
        {
            var conversion = await _currencyClient.ConvertAsync(SenderWallet.Currency, receiverWallet.Currency, transactioDto.Amount);
            if (conversion == null)
            {
                throw new InvalidOperationException("Conversion failed");
            }

            conversionValue = conversion.Value;
        }
        
        SenderWallet.Balance -= transactioDto.Amount;
        receiverWallet.Balance += conversionValue;

        await _walletRepository.UpdateAsync(SenderWallet);
        await _walletRepository.UpdateAsync(receiverWallet);
        await _transactionService.ConfirmTransaction(transactionDto);

        return transactionDto;
    }

    public async Task DeleteWallet(int id)
    {
        var wallet = await _walletRepository.GetByIdAsync(id);
        await _walletRepository.DeleteAsync(wallet);
    }

    public async Task<IEnumerable<WalletDTO?>> GetAllAsync()
    {
        // return await _walletRepository.ListAllAsync();
        var wallets = await _walletRepository.ListAllAsync();
        var walletDTOs = new List<WalletDTO>();

        foreach (var wallet in wallets)
        {
            walletDTOs.Add(new WalletDTO
            {
                Currency = wallet.Currency,
                Balance = wallet.Balance,
                UserId = wallet.UserId,
                Transactions = (wallet.Transactions ?? new List<Transaction>()).
                    Select(t => new TransactionDTO
                    {
                        Type = t.Type,
                        FromCurrency = t.FromCurrency,
                        ToCurrency = t.ToCurrency,
                        Amount = t.Amount,
                        Status = t.Status,
                        WalletId = t.WalletId
                    }).ToList()
            });
        }

        return walletDTOs.ToArray();
    }
    
    public async Task<WalletDTO?> GetWalletDetailsAsync(int id)
    {
        // return await _walletRepository.GetByIdAsync(id);
        var wallet = await _walletRepository.GetByIdAsync(id);

        return wallet != null ? new WalletDTO
        {
            Currency = wallet.Currency,
            Balance = wallet.Balance,
            UserId = wallet.UserId,
            Transactions = (wallet.Transactions ?? new List<Transaction>()).
                Select(t => new TransactionDTO
                {
                    Type = t.Type,
                    FromCurrency = t.FromCurrency,
                    ToCurrency = t.ToCurrency,
                    Amount = t.Amount,
                    Status = t.Status,
                    WalletId = t.WalletId
                }).ToList()
        } : null;
    }
    
    public async Task<IEnumerable<WalletDTO?>> ListAllByUserIdAsync(int userId)
    {
        // return await _walletRepository.ListAllByUserIdAsync(userId);
        var wallets = await _walletRepository.ListAllByUserIdAsync(userId);
        var walletDTOs = new List<WalletDTO>();

        foreach (var wallet in wallets)
        {
            walletDTOs.Add(new WalletDTO
            {
                Currency = wallet.Currency,
                Balance = wallet.Balance,
                UserId = wallet.UserId,
                Transactions = (wallet.Transactions ?? new List<Transaction>()).
                    Select(t => new TransactionDTO
                    {
                        Type = t.Type,
                        FromCurrency = t.FromCurrency,
                        ToCurrency = t.ToCurrency,
                        Amount = t.Amount,
                        Status = t.Status,
                        WalletId = t.WalletId
                    }).ToList()
            });
        }

        return walletDTOs.ToArray();
    }
}