public class HistoryRepository : IHistoryRepository
{
    private readonly CurrencyDbContext _context;

    public HistoryRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public void Add(History History)
    {
        _context.History.Add(History);
        _context.SaveChanges();
    }

    public History? GetById(int id) => _context.History.Find(id);

    // Criando método como array function
    public List<History>? ListAll() => _context.History?.ToList() ?? new List<History>();


    public void Update(History History)
    {
        if (History == null)
        {
            throw new ArgumentNullException(nameof(History));
        }
        _context.History.Update(History);
        _context.SaveChanges();
    }

    public void Delete(History History)
    {
        _context.History.Remove(History);
        _context.SaveChanges();
    }

}
