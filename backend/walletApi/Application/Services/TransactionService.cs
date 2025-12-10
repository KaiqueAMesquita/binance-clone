public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWalletRepository _walletRepository;

    public TransactionService(ITransactionRepository transactionRepository, IWalletRepository walletRepository)
    {
        _transactionRepository = transactionRepository;
        _walletRepository = walletRepository;
    }

    // public async Task RegisterHistory(History history)
    // {
    //     await _historyRepository.Add(history);
    // }

    // public async Task<HistoryDTO?> GetHistoryDetails(int id)
    // {
    //     var history = await _historyRepository.GetById(id);
    //     return history != null ? new HistoryDTO
    //     {
    //         Id = history.Id,
    //         Datetime = history.Datetime,
    //         Price = history.Price,
    //         CurrencyId = history.CurrencyId
    //     } : null;
    // }

    // public async Task<HistoryDTO[]> GetAllHistories()
    // {
    //     var histories = await _historyRepository.ListAll();
    //     var historyDTOs = new List<HistoryDTO>();

    //     foreach (var history in histories)
    //     {
    //         historyDTOs.Add(new HistoryDTO
    //         {
    //             Id = history.Id,
    //             Datetime = history.Datetime,
    //             Price = history.Price,
    //             CurrencyId = history.CurrencyId
    //         });
    //     }

    //     return historyDTOs.ToArray();
    // }

    // public async Task<HistoryDTO?> UpdateHistory(HistoryDTO historyDto, int id)
    // {
    //     var currency = await _currencyService.GetCurrencyById(historyDto.CurrencyId);

    //     var history = await _historyRepository.GetById(id);
    //     if (history == null)
    //     {
    //         return null;
    //     }

    //     history.Datetime = historyDto.Datetime;
    //     history.Price = historyDto.Price;
    //     history.CurrencyId = historyDto.CurrencyId;
    //     history.Currency = currency;

    //     await _historyRepository.Update(history);

    //     return new HistoryDTO
    //     {
    //         Datetime = history.Datetime,
    //         Price = history.Price,
    //         CurrencyId = history.CurrencyId
    //     };
    // }

    // public async Task DeleteHistory(int id)
    // {
    //     var history = await _historyRepository.GetById(id);
    //     await _historyRepository.Delete(history);
    // }

    public async Task<Transaction> AddTransactionAsync(int walletId, Transaction transaction)
    {
        var wallet = await _walletRepository.GetByIdAsync(walletId);
        if (wallet == null)
            throw new KeyNotFoundException("Wallet not found");
            
        transaction.WalletId = walletId;
        
        // Update wallet balance based on transaction type
        decimal amountChange = 0;
        
        switch (transaction.Type)
        {
            case TransactionType.Deposit:
            case TransactionType.Purchase:
                amountChange = transaction.Amount;
                break;
            case TransactionType.Withdrawal:
            case TransactionType.Sale:
            case TransactionType.Fee:
                amountChange = -transaction.Amount;
                if (wallet.Balance < Math.Abs(amountChange))
                    throw new InvalidOperationException("Insufficient funds");
                break;
        }
        
        wallet.Balance += amountChange;
        await _walletRepository.UpdateAsync(wallet);
        
        return await _transactionRepository.AddTransactionAsync(transaction);
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByWalletIdAsync(int walletId)
    {
        return await _transactionRepository.GetTransactionsByWalletIdAsync(walletId);
    }
}