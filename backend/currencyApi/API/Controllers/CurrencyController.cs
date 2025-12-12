using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _currencyService;

    public CurrencyController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    // ... (Seus métodos CRUD: Register, Get, Update, Delete mantêm iguais) ...
    [HttpPost]
    public async Task<IActionResult> RegisterCurrency(CurrencyDTO currencyDto) => Ok(await _currencyService.RegisterCurrency(currencyDto));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCurrencyDetails(int id) {
        var c = await _currencyService.GetCurrencyDetails(id);
        return c != null ? Ok(c) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCurrencies() => Ok(await _currencyService.GetAllCurrencies());

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCurrency(int id, CurrencyDTO currencyDTO) {
        if (id != currencyDTO.Id) return BadRequest();
        var c = await _currencyService.UpdateCurrency(id, currencyDTO);
        return c != null ? Ok(c) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCurrency(int id) {
        await _currencyService.DeleteCurrency(id);
        return Ok();
    }

    [HttpGet("convert")]
    public async Task<IActionResult> Convert([FromQuery] string from, [FromQuery] string to, [FromQuery] decimal amount)
    {
        try
        {
            // 1. SANITIZAÇÃO (Limpa espaços e força maiúsculo para bater com o banco)
            // Se vier "usdt ", vira "USDT"
            string cleanFrom = from?.Trim().ToUpper() ?? "";
            string cleanTo = to?.Trim().ToUpper() ?? "";

            // 2. Busca no banco usando a string limpa
            var currencyFrom = await _currencyService.GetLastPriceBySymbolAsync(cleanFrom);
            var currencyTo = await _currencyService.GetLastPriceBySymbolAsync(cleanTo);

            // 3. Validação Real (Sem Mocks, como você pediu)
            if (currencyFrom == null)
                return NotFound(new { message = $"A moeda de origem '{cleanFrom}' não foi encontrada no banco de dados (IDs disponíveis: 16, 17...)." });
            
            if (currencyTo == null)
                return NotFound(new { message = $"A moeda de destino '{cleanTo}' não foi encontrada no banco de dados." });

            // 4. Extração de Preço (Função Local)
            decimal GetPrice(dynamic currency)
            {
                // Se for a própria moeda de lastro (USD/USDT), vale 1
                // Verifica variações comuns de dólar
                string sym = currency.Symbol.ToString().ToUpper();
                string back = currency.Backing.ToString().ToUpper();
                
                if (sym == back) return 1;
                if (sym == "USDT" && back == "USD") return 1; // Força paridade USDT/USD

                // Verifica preço histórico
                if (currency.LastPrice != null)
                {
                    decimal val = 0;
                    // Tenta ler o valor dinamicamente
                    try { val = (decimal)currency.LastPrice.Value; } catch { val = (decimal)currency.LastPrice; }
                    
                    if (val > 0)
                    {
                        return currency.Reverse ? (1 / val) : val;
                    }
                }
                
                return 0;
            }

            decimal unitValueFrom = GetPrice(currencyFrom);
            decimal unitValueTo = GetPrice(currencyTo);

            // 5. Validação de Preço Zero
            if (unitValueFrom == 0) return BadRequest(new { message = $"A moeda '{cleanFrom}' existe mas está com preço 0." });
            if (unitValueTo == 0) return BadRequest(new { message = $"A moeda '{cleanTo}' existe mas está com preço 0." });

            // 6. Cálculo
            decimal conversionRate = unitValueFrom / unitValueTo;
            decimal convertedValue = amount * conversionRate;

            return Ok(new
            {
                From = from.ToUpper(),
                To = to.ToUpper(),
                Amount = amount,
                Rate = conversionRate,
                Value = convertedValue
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno na conversão", details = ex.Message });
        }
    }
    
    // ... (Métodos Summary e Chart mantêm iguais)
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaries() => Ok(await _currencyService.GetCurrencySummariesAsync());

    [HttpGet("{id}/chart")]
    public async Task<IActionResult> GetChart(int id, int quantity) => Ok(await _currencyService.GetChartDataAsync(id, quantity));
}