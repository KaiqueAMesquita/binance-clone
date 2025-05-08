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
    public IActionResult RegisterCurrency(CurrencyDTO currencyDto)
    {
        var result = _currencyService.RegisterCurrency(currencyDto);
        return Ok(result);
    }

     [HttpGet("{id}")]
    public IActionResult GetCurrencyDetails(int id)
    {
        var currency = _currencyService.GetCurrencyDetails(id);
        return currency != null ? Ok(currency) : NotFound();
    }

    [HttpGet]
    public IActionResult GetAllCurrencies()
    {
        var currencys = _currencyService.GetAllCurrencies();
        return Ok(currencys);
    }

  
}