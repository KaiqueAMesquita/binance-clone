public class CurrencyRepository : ICurrencyRepository
{
    private readonly CurrencyDbContext _context;

    public CurrencyRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public void Add(Currency Currency)
    {
        _context.Currency.Add(Currency);
        _context.SaveChanges();
    }

    public Currency? GetById(int id) => _context.Currency.Find(id);

    // Criando método como array function
    public List<Currency>? ListAll() => _context.Currency?.ToList() ?? new List<Currency>();


    public void Update(Currency Currency)
    {
        if (Currency == null)
        {
            throw new ArgumentNullException(nameof(Currency));
        }
        _context.Currency.Update(Currency);
        _context.SaveChanges();
    }
    
    // Criando método de forma tradicional
    // public List<Currency>? ListAll()
    // {
    //     return _context.Currency?.ToList() ?? new List<Currency>();
    // }

    public void Delete(Currency Currency)
    {
        _context.Currency.Remove(Currency);
        _context.SaveChanges();
    }

    public Currency? GetByEmail(string email) => _context.Currency.FirstOrDefault(u => u.Email == email);
}
