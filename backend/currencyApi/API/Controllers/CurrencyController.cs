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

      [HttpPut("{id}")]
    public IActionResult UpdateCurrency(int id, CurrencyDTO currencyDTO){
        if(id != currencyDTO.Id ){
            return BadRequest();
        }
        
        var currency = _currencyService.UpdateCurrency(id, currencyDTO);
        if(currency == null){
            return NotFound();
        }
        return Ok(currency);
    }

  
}