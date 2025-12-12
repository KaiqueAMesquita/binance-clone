using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;
var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key is missing"));

builder.Services.AddHttpClient<ICurrencyClient, CurrencyClient>(c =>
    c.BaseAddress = new Uri(builder.Configuration["CurrencyApi:BaseUrl"])
);

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
    });
// Configuração de injeção de dependências
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "API do grupo DKLLM",
        Version = "v1",
        Description = "API para gerenciamento de carteiras digitais",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "DKLLM",
            Email = "emailfalso@gmail.com.br"
        }
    });

    // Add JWT Bearer Authentication to Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer",
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

});




builder.Services.AddApplicationServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Wallet API V1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

// Only enable HTTPS redirection when an HTTPS address is configured
// var server = app.Services.GetService<IServer>();
// var addressesFeature = server?.Features.Get<IServerAddressesFeature>();
// if (addressesFeature != null && addressesFeature.Addresses.Any(a => a.StartsWith("https://", StringComparison.OrdinalIgnoreCase)))
// {
//     app.UseHttpsRedirection();
// }
// else
// {
//     var startupLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
//     startupLogger.LogInformation("HTTPS not configured; skipping HTTPS redirection.");
// }

//Habilita o CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();
    // Ensure DestinyWalletId column in Transactions allows NULL (fix for existing DB schema)
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<WalletDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("SchemaFix");
            var conn = db.Database.GetDbConnection();
            conn.Open();
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "PRAGMA table_info('Transactions');";
                using (var reader = cmd.ExecuteReader())
                {
                    var destinyNotNull = false;
                    while (reader.Read())
                    {
                        var colName = reader.GetString(1);
                        var notnull = reader.GetInt32(3);
                        if (string.Equals(colName, "DestinyWalletId", StringComparison.OrdinalIgnoreCase) && notnull == 1)
                        {
                            destinyNotNull = true;
                            break;
                        }
                    }

                    if (destinyNotNull)
                    {
                        logger.LogInformation("Detected NOT NULL DestinyWalletId. Rebuilding Transactions table to allow NULL.");
                        reader.Close();
                        // Disable foreign keys during schema change
                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = "PRAGMA foreign_keys = OFF;";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = @"
CREATE TABLE IF NOT EXISTS Transactions_new (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Amount TEXT,
    CreatedAt TEXT,
    DestinyWalletId INTEGER,
    FromCurrency TEXT NOT NULL,
    Status INTEGER,
    ToCurrency TEXT NOT NULL,
    Type INTEGER,
    WalletId INTEGER NOT NULL,
    FOREIGN KEY (DestinyWalletId) REFERENCES Wallets (Id) ON DELETE RESTRICT,
    FOREIGN KEY (WalletId) REFERENCES Wallets (Id) ON DELETE CASCADE
);";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = @"INSERT INTO Transactions_new (Id, Amount, CreatedAt, DestinyWalletId, FromCurrency, Status, ToCurrency, Type, WalletId)
SELECT Id, Amount, CreatedAt, DestinyWalletId, FromCurrency, Status, ToCurrency, Type, WalletId FROM Transactions;";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = "DROP TABLE Transactions;";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = "ALTER TABLE Transactions_new RENAME TO Transactions;";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = "CREATE INDEX IF NOT EXISTS IX_Transactions_DestinyWalletId ON Transactions (DestinyWalletId);";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = "CREATE INDEX IF NOT EXISTS IX_Transactions_WalletId ON Transactions (WalletId);";
                            tcmd.ExecuteNonQuery();
                        }

                        using (var tcmd = conn.CreateCommand())
                        {
                            tcmd.CommandText = "PRAGMA foreign_keys = ON;";
                            tcmd.ExecuteNonQuery();
                        }

                        logger.LogInformation("Transactions table rebuilt; DestinyWalletId is now nullable.");
                    }
                    else
                    {
                        logger.LogInformation("DestinyWalletId already nullable or column not present; no action needed.");
                    }
                }
            }
            conn.Close();
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("SchemaFix");
            logger.LogError(ex, "Error while ensuring DestinyWalletId nullability");
        }
    }

    app.Run();