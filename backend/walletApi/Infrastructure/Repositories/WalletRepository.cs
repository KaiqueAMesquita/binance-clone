using Microsoft.EntityFrameworkCore;
public class WalletRepository : IWalletRepository
{
    private readonly WalletDbContext _context;

    public WalletRepository(WalletDbContext context)
    {
        _context = context;
    }

    // public async Task Add(Wallet wallet)
    // {
    //     await _context.Wallets.AddAsync(wallet);
    //     await _context.SaveChangesAsync();
    // }

    // public async Task<Wallet?> GetById(int id) =>
    //     await _context.Wallets
    //         .Include(c => c.Histories)
    //         .FirstOrDefaultAsync(c => c.Id == id);

    // public async Task<IEnumerable<Wallet?>> ListAll() =>
    //     await _context.Wallets
    //         .Include(c => c.Histories)
    //         .ToListAsync() ?? new List<Wallet>();

    // public async Task Update(Wallet wallet)
    // {
    //     if (wallet == null)
    //     {
    //         throw new ArgumentNullException(nameof(wallet));
    //     }
    //     _context.Wallets.Update(wallet);
    //     await _context.SaveChangesAsync();
    // }

    // public async Task Delete(Wallet wallet)
    // {
    //     _context.Wallets.Remove(wallet);
    //     await _context.SaveChangesAsync();
    // }

    // // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    // public async Task<WalletWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol)
    // {
    //     var wallet = await _context.Wallets
    //         .Where(c => c.Symbol == symbol.ToUpper())
    //         .Select(c => new WalletWithLastPriceDto
    //         {
    //             Id = c.Id,
    //             Symbol = c.Symbol,
    //             Name = c.Name,
    //             Backing = c.Backing,
    //             Reverse = c.Reverse,
    //             LastPrice = c.Histories
    //                 .OrderByDescending(h => h.Datetime)
    //                 .Select(h => h.Price)
    //                 .FirstOrDefault(),
    //             LastPriceDate = c.Histories
    //                 .OrderByDescending(h => h.Datetime)
    //                 .Select(h => h.Datetime)
    //                 .FirstOrDefault()
    //         })
    //         .FirstOrDefaultAsync();

    //     return wallet;
    // }

    // public async Task<IEnumerable<WalletSummaryDto>> GetWalletSummariesAsync()
    // {
    //     var wallets = await _context.Wallets.ToListAsync();
    //     var summaries = new List<WalletSummaryDto>();
    //     var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

    //     foreach (var wallet in wallets)
    //     {
    //         var lastPrice = await _context.Histories
    //             .Where(h => h.WalletId == wallet.Id)
    //             .OrderByDescending(h => h.Datetime)
    //             .Select(h => h.Price)
    //             .FirstOrDefaultAsync();

    //         if (lastPrice == 0) continue;

    //         // Tenta pegar a cotação de 30 dias atrás
    //         var oldPrice = await _context.Histories
    //             .Where(h => h.WalletId == wallet.Id && h.Datetime <= thirtyDaysAgo)
    //             .OrderByDescending(h => h.Datetime)
    //             .Select(h => h.Price)
    //             .FirstOrDefaultAsync();

    //         // Se não encontrou, pega a mais antiga disponível
    //         if (oldPrice == 0)
    //         {
    //             oldPrice = await _context.Histories
    //                 .Where(h => h.WalletId == wallet.Id)
    //                 .OrderBy(h => h.Datetime)
    //                 .Select(h => h.Price)
    //                 .FirstOrDefaultAsync();
    //         }

    //         if (oldPrice == 0) continue;

    //         decimal change = ((lastPrice - oldPrice) / oldPrice) * 100;

    //         summaries.Add(new WalletSummaryDto
    //         {
    //             Id = wallet.Id,
    //             Symbol = wallet.Symbol,
    //             Name = wallet.Name,
    //             Price = wallet.Reverse ? Math.Round(1 / lastPrice, 4) : Math.Round(lastPrice, 4),
    //             Change = Math.Round(change, 2)
    //         });
    //     }

    //     return summaries;
    // }

    // public async Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int walletId, int quantity)
    // {
    //     return await _context.Histories
    //         .Where(h => h.WalletId == walletId)
    //         .OrderByDescending(h => h.Datetime)
    //         .Take(quantity)
    //         .OrderBy(h => h.Datetime) // para exibir no gráfico da esquerda para direita
    //         .Select(h => new ChartPointDto
    //         {
    //             Time = h.Datetime.ToUniversalTime().ToString("o"), // ajusta para UTC-3
    //             Value = Math.Round(h.Price, 4)
    //         })
    //         .ToListAsync();
    // }

    public async Task<Wallet> AddAsync(Wallet wallet)
    {
        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync();
        return wallet;
    }

    public async Task UpdateAsync(Wallet wallet)
    {
        wallet.UpdatedAt = DateTime.UtcNow;
        // _context.Entry(wallet).State = EntityState.Modified;

        _context.Wallets.Update(wallet);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Wallet wallet)
    {
        _context.Wallets.Remove(wallet);
        await _context.SaveChangesAsync();
    }

    // public async Task<IEnumerable<Wallet?>> ListAllAsync()
    // {
    //     return await _context.Wallets.ToListAsync();
    // }

    public async Task<IEnumerable<Wallet?>> ListAllAsync() =>
        await _context.Wallets
            .Include(c => c.Transactions)
            .ToListAsync() ?? new List<Wallet>();
    
    public async Task<Wallet?> GetByIdAsync(int id)
    {
        return await _context.Wallets
            .Include(w => w.Transactions)
            .FirstOrDefaultAsync(w => w.Id == id);
    }
    
    public async Task<IEnumerable<Wallet?>> ListAllByUserIdAsync(int userId)
    {
        return await _context.Wallets
            .Where(w => w.UserId == userId)
            .ToListAsync();
    }
    
    public async Task<Wallet?> GetByUserAndCurrencyAsync(int userId, string currency)
    {
        return await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Currency == currency);
    }
}