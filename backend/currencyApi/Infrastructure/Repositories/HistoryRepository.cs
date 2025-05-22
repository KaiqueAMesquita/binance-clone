public class HistoryRepository : IHistoryRepository
{
    private readonly CurrencyDbContext _context;

    public HistoryRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public void Add(History history)
    {
        _context.Histories.Add(history);
        _context.SaveChanges();
    }

    public History? GetById(int id) => _context.Histories.Find(id);

    // Criando método como array function
    public List<History>? ListAll() => _context.Histories?.ToList() ?? new List<History>();


    public void Update(History history)
    {
        if (history == null)
        {
            throw new ArgumentNullException(nameof(history));
        }
        _context.Histories.Update(history);
        _context.SaveChanges();
    }

    public void Delete(History history)
    {
        _context.Histories.Remove(history);
        _context.SaveChanges();
    }

}
