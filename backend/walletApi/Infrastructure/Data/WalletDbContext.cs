using Microsoft.EntityFrameworkCore;

public class WalletDbContext : DbContext
{
    public WalletDbContext(DbContextOptions<WalletDbContext> options) : base(options) { }
    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Wallet>(entity => {
            entity.HasKey(wallet => wallet.Id);
            entity.Property(wallet => wallet.UserId).IsRequired();
            entity.Property(wallet => wallet.Currency).IsRequired().HasMaxLength(100);

            entity.HasMany(wallet => wallet.Transactions)
                .WithOne(transaction => transaction.Wallet)
                .HasForeignKey(transaction => transaction.WalletId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Transaction>(entity => {
            entity.HasKey(transaction => transaction.Id);
            entity.Property(transaction => transaction.Type).IsRequired();
            entity.Property(transaction => transaction.Amount).IsRequired();
            entity.Property(transaction => transaction.Currency).IsRequired();
        });
    }

    // public DbSet<Wallet> Wallets { get; set; }
    // public DbSet<Transaction> Transactions { get; set; }
}