using Microsoft.EntityFrameworkCore;

public class TransactionRepository : ITransactionRepository
{
    private readonly WalletDbContext _context;

    public TransactionRepository(WalletDbContext context)
    {
        _context = context;
    }

    // public async Task Add(History history)
    // {
    //     await _context.Histories.AddAsync(history);
    //     await _context.SaveChangesAsync();
    // }

    // public async Task<History?> GetById(int id) => await _context.Histories.FindAsync(id);

    // // Criando método como array function
    // public async Task<IEnumerable<History?>> ListAll() => await _context.Histories.ToListAsync() ?? new List<History>();

    // public async Task Update(History history)
    // {
    //     if (history == null)
    //     {
    //         throw new ArgumentNullException(nameof(history));
    //     }
    //     _context.Histories.Update(history);
    //     await _context.SaveChangesAsync();
    // }

    // public async Task Delete(History history)
    // {
    //     _context.Histories.Remove(history);
    //     await _context.SaveChangesAsync();
    // }

    public async Task<Transaction> AddTransactionAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task UpdateAsync(Transaction transaction)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Transaction transaction)
    {
        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByWalletIdAsync(int walletId)
    {
        return await _context.Transactions
            .Where(t => t.WalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
