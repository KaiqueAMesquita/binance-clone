using Microsoft.EntityFrameworkCore;

public class HistoryRepository : IHistoryRepository
{
    private readonly CurrencyDbContext _context;

    public HistoryRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public async Task Add(History history)
    {
        await _context.Histories.AddAsync(history);
        await _context.SaveChangesAsync();
    }

    public async Task<History?> GetById(int id) => await _context.Histories.FindAsync(id);

    // Criando método como array function
    public async Task<IEnumerable<History?>> ListAll() => await _context.Histories.ToListAsync() ?? new List<History>();

    public async Task Update(History history)
    {
        if (history == null)
        {
            throw new ArgumentNullException(nameof(history));
        }
        _context.Histories.Update(history);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(History history)
    {
        _context.Histories.Remove(history);
        await _context.SaveChangesAsync();
    }

}
