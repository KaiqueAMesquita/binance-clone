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
    public IActionResult RegisterHistory(HistoryDTO historyDto, int currencyId)
    {
        var result = _historyService.RegisterHistory(historyDto, currencyId);
        return Ok(result);
    }

     [HttpGet("{id}")]
    public IActionResult GetHistoryDetails(int id)
    {
        var history = _historyService.GetHistoryDetails(id);
        return history != null ? Ok(history) : NotFound();
    }

    [HttpGet]
    public IActionResult GetAllHistories()
    {
        var histories = _historyService.GetAllHistories();
        return Ok(histories);
    }
}