public interface ITransactionService
{
    // Task RegisterHistory(History history);
    // Task<HistoryDTO?> GetHistoryDetails(int id);
    // Task<HistoryDTO[]> GetAllHistories();
    // Task<HistoryDTO?> UpdateHistory(HistoryDTO historyDto, int id);
    // Task DeleteHistory(int id);

    Task<IEnumerable<Transaction>> GetTransactionsByWalletIdAsync(int walletId);
    Task<Transaction> AddTransactionAsync(int walletId, Transaction transaction);
}