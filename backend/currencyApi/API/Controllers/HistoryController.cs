using Microsoft.AspNetCore.Mvc;
using CurrencyApi.API.DTOs;
[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;

    public HistoryController(IHistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpPost]
    public IActionResult RegisterHistory(HistoryRequestDTO historyDto)
    {
        var result = _historyService.RegisterHistory(historyDto);
        return Ok(result);
    }

    //  [HttpGet("{id}")]
    // public IActionResult GetHistoryDetails(int id)
    // {
    //     var history = _historyService.GetHistoryDetails(id);
    //     return history != null ? Ok(history) : NotFound();
    // }

    // [HttpGet]
    // public IActionResult GetAllCurrencies()
    // {
    //     var histories = _historyService.GetAllCurrencies();
    //     return Ok(histories);
    // }
}