using Microsoft.EntityFrameworkCore;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IWalletService, WalletService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddDbContext<WalletDbContext>(options =>
            options.UseSqlite("Data Source=walletdb.sqlite"));

        return services;
    }
}