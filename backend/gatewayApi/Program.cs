using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5048");

// Configurações do Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Adiciona autenticação com JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Add Ocelot services to the container
// builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddOcelot();
var app = builder.Build();

// Middleware de autenticação/autorização ANTES do Ocelot
app.UseAuthentication();
app.UseAuthentication();

app.UseOcelot().Wait();

app.Run();

