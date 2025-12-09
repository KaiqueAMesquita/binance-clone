public interface ITransactionRepository
{
//     Task Add(Transaction history);
//     Task<Transaction?> GetById(int id);
//     Task<IEnumerable<Transaction?>> ListAll();
//     Task Update(Transaction transaction);
//     Task Delete(Transaction transaction);

    Task<Transaction> AddTransactionAsync(Transaction transaction);
    Task<IEnumerable<Transaction>> GetTransactionsByWalletIdAsync(int walletId);
}