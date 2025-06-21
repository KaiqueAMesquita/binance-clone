using CurrencyAPI.API.DTOs;
using Microsoft.EntityFrameworkCore;
public class CurrencyRepository : ICurrencyRepository
{
    private readonly CurrencyDbContext _context;

    public CurrencyRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public async Task Add(Currency currency)
    {
        await _context.Currencies.AddAsync(currency);
        await _context.SaveChangesAsync();
    }

    public async Task<Currency?> GetById(int id) =>
        await _context.Currencies
            .Include(c => c.Histories)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IEnumerable<Currency?>> ListAll() =>
        await _context.Currencies
            .Include(c => c.Histories)
            .ToListAsync() ?? new List<Currency>();

    public async Task Update(Currency currency)
    {
        if (currency == null)
        {
            throw new ArgumentNullException(nameof(currency));
        }
        _context.Currencies.Update(currency);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(Currency currency)
    {
        _context.Currencies.Remove(currency);
        await _context.SaveChangesAsync();
    }

    // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    public async Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol)
    {
        var currency = await _context.Currencies
            .Where(c => c.Symbol == symbol.ToUpper())
            .Select(c => new CurrencyWithLastPriceDto
            {
                Id = c.Id,
                Symbol = c.Symbol,
                Name = c.Name,
                Backing = c.Backing,
                Reverse = c.Reverse,
                LastPrice = c.Histories
                    .OrderByDescending(h => h.Datetime)
                    .Select(h => h.Price)
                    .FirstOrDefault(),
                LastPriceDate = c.Histories
                    .OrderByDescending(h => h.Datetime)
                    .Select(h => h.Datetime)
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        return currency;
    }

    public async Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync()
    {
        var currencies = await _context.Currencies.ToListAsync();
        var summaries = new List<CurrencySummaryDto>();
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

        foreach (var currency in currencies)
        {
            var lastPrice = await _context.Histories
                .Where(h => h.CurrencyId == currency.Id)
                .OrderByDescending(h => h.Datetime)
                .Select(h => h.Price)
                .FirstOrDefaultAsync();

            if (lastPrice == 0) continue;

            // Tenta pegar a cotação de 30 dias atrás
            var oldPrice = await _context.Histories
                .Where(h => h.CurrencyId == currency.Id && h.Datetime <= thirtyDaysAgo)
                .OrderByDescending(h => h.Datetime)
                .Select(h => h.Price)
                .FirstOrDefaultAsync();

            // Se não encontrou, pega a mais antiga disponível
            if (oldPrice == 0)
            {
                oldPrice = await _context.Histories
                    .Where(h => h.CurrencyId == currency.Id)
                    .OrderBy(h => h.Datetime)
                    .Select(h => h.Price)
                    .FirstOrDefaultAsync();
            }

            if (oldPrice == 0) continue;

            decimal change = ((lastPrice - oldPrice) / oldPrice) * 100;

            summaries.Add(new CurrencySummaryDto
            {
                Id = currency.Id,
                Symbol = currency.Symbol,
                Name = currency.Name,
                Price = currency.Reverse ? Math.Round(1 / lastPrice, 4) : Math.Round(lastPrice, 4),
                Change = Math.Round(change, 2)
            });
        }

        return summaries;
    }

    public async Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity)
    {
        return await _context.Histories
            .Where(h => h.CurrencyId == currencyId)
            .OrderByDescending(h => h.Datetime)
            .Take(quantity)
            .OrderBy(h => h.Datetime) // para exibir no gráfico da esquerda para direita
            .Select(h => new ChartPointDto
            {
                Time = h.Datetime.ToUniversalTime().ToString("o"), // ajusta para UTC-3
                Value = Math.Round(h.Price, 4)
            })
            .ToListAsync();
    }
}
