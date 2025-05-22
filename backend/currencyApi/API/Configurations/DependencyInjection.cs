using Microsoft.EntityFrameworkCore;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrencyRepository, CurrencyRepository>();
        services.AddScoped<IHistoryRepository, HistoryRepository>();
        services.AddScoped<ICurrencyService, CurrencyService>();
        services.AddScoped<IHistoryService, HistoryService>();
        services.AddDbContext<CurrencyDbContext>(options =>
            options.UseSqlite("Data Source=userdb.sqlite"));
        return services;
    }
}