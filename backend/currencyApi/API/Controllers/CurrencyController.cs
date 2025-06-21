using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _currencyService;

    public CurrencyController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterCurrency(CurrencyDTO currencyDto)
    {
        var result = await _currencyService.RegisterCurrency(currencyDto);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCurrencyDetails(int id)
    {
        var currency = await _currencyService.GetCurrencyDetails(id);
        return currency != null ? Ok(currency) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCurrencies()
    {
        var currencies = await _currencyService.GetAllCurrencies();
        return Ok(currencies);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCurrency(int id, CurrencyDTO currencyDTO)
    {
        if (id != currencyDTO.Id)
        {
            return BadRequest();
        }

        var currency = await _currencyService.UpdateCurrency(id, currencyDTO);
        if (currency == null)
        {
            return NotFound();
        }
        return Ok(currency);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCurrency(int id)
    {
        try
        {
            await _currencyService.DeleteCurrency(id);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
    
    // GET api/currencies/convert?from=USD&to=EUR&amount=100
    [HttpGet("convert")]
    public async Task<IActionResult> Convert(string from, string to, decimal amount)
    {
        var currencyFrom = await _currencyService.GetLastPriceBySymbolAsync(from);
        var currencyTo = await _currencyService.GetLastPriceBySymbolAsync(to);
        decimal conversionRate = 0;

        if (currencyFrom.Backing == currencyTo.Backing)
        {
            decimal valueFrom = currencyFrom.Symbol == currencyFrom.Backing
                ? 1 : currencyFrom.Reverse
                    ? 1 / currencyFrom.LastPrice.Value
                    : currencyFrom.LastPrice.Value;

            decimal valueTo = currencyTo.Symbol == currencyTo.Backing
                ? 1 : currencyTo.Reverse
                    ? 1 / currencyTo.LastPrice.Value
                    : currencyTo.LastPrice.Value;

            conversionRate = valueFrom / valueTo;
        }

        decimal value = amount * conversionRate;

        var ret = new
        {
            From = currencyFrom,
            To = currencyTo,
            Amount = amount,
            Rate = conversionRate,
            Value = value,
        };


        return Ok(ret);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaries()
    {
        var result = await _currencyService.GetCurrencySummariesAsync();
        return Ok(result);
    }
    
    [HttpGet("{id}/chart")]
    public async Task<IActionResult> GetChart(int id, int quantity)
    {
        var chartData = await _currencyService.GetChartDataAsync(id, quantity);
        return Ok(chartData);
    }
}