using Microsoft.EntityFrameworkCore;

public class CurrencyDbContext : DbContext
{
    public CurrencyDbContext(DbContextOptions<CurrencyDbContext> options) : base(options) { }
    public DbSet<Currency> Currencies { get; set; }
    public DbSet<History> Histories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Currency>(entity => {
            entity.HasKey(currency => currency.Id);
            entity.Property(currency => currency.Symbol).IsRequired().HasMaxLength(10);
            entity.Property(currency => currency.Name).IsRequired().HasMaxLength(100);
            entity.Property(currency => currency.Backing).IsRequired().HasMaxLength(50);

            entity.HasMany(currency => currency.Histories)
                .WithOne(history => history.Currency)
                .HasForeignKey(history => history.CurrencyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<History>(entity => {
            entity.HasKey(history => history.Id);
            entity.Property(history => history.Price).IsRequired();
            entity.Property(history => history.Datetime).IsRequired();
        });
    }
}