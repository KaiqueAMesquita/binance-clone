public interface ITransactionService
{
    // Task RegisterHistory(History history);
    // Task<HistoryDTO?> GetHistoryDetails(int id);
    // Task<HistoryDTO[]> GetAllHistories();
    // Task<HistoryDTO?> UpdateHistory(HistoryDTO historyDto, int id);
    // Task DeleteHistory(int id);

    // Task<TransactionDTO> AddTransactionAsync(int walletId, TransactionDTO transactionDto);
    Task<TransactionDTO> Deposit(DepositRequestDTO depositRequest);
    Task<TransactionDTO> RegisterTransaction(TransactionDTO transactionDto);
    Task ConfirmTransaction(TransactionDTO transactionDto);
    Task<IEnumerable<TransactionDTO>> GetByWalletIdAsync(int walletId);
}