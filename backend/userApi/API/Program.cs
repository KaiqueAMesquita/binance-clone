using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuração de injeção de dependências
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "API do grupo DKLLM",
        Version = "v1",
        Description = "API para gerenciamento de usuários",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "DKLLM",
            Email = "emailfalso@gmail.com.br"
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
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();