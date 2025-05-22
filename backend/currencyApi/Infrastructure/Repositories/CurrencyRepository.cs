using Microsoft.EntityFrameworkCore;
public class CurrencyRepository : ICurrencyRepository
{
    private readonly CurrencyDbContext _context;

    public CurrencyRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public void Add(Currency currency)
    {
        _context.Currencies.Add(currency);
        _context.SaveChanges();
    }

    public Currency? GetById(int id) =>
        _context.Currencies
            .Include(c => c.Histories)
            .FirstOrDefault(c => c.Id == id);

    public List<Currency>? ListAll() =>
        _context.Currencies?
            .Include(c => c.Histories)
            .ToList() ?? new List<Currency>();

    public void Update(Currency currency)
    {
        if (currency == null)
        {
            throw new ArgumentNullException(nameof(currency));
        }
        _context.Currencies.Update(currency);
        _context.SaveChanges();
    }

    // Criando método de forma tradicional
    // public List<Currency>? ListAll()
    // {
    //     return _context.Currencies?.ToList() ?? new List<Currency>();
    // }

    public void Delete(Currency currency)
    {
        _context.Currencies.Remove(currency);
        _context.SaveChanges();
    }

}
