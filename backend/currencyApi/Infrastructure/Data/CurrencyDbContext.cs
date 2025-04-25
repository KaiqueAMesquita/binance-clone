using Microsoft.EntityFrameworkCore;

public class CurrencyDbContext : DbContext
{
    public UserDbContext(DbContextOptions<CurrencyDbContext> options) : base(options) { }
    public DbSet<Currency> Currency { get; set; }
}