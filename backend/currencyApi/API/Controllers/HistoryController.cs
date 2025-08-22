using Microsoft.AspNetCore.Mvc;
using CurrencyApi.API.DTOs;
using CurrencyAPI.Application.Mappers;
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
    public async Task<IActionResult> RegisterHistory(HistoryDTO historyDto)
    {
        await _historyService.RegisterHistory(historyDto.ToEntity());
        return Created("", historyDto);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHistoryDetails(int id)
    {
        var history = await _historyService.GetHistoryDetails(id);
        return history != null ? Ok(history) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllHistories()
    {
        var histories = await _historyService.GetAllHistories();
        return Ok(histories);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHistory(HistoryDTO historyDto, int id)
    {
        var history = await _historyService.UpdateHistory(historyDto, id);
        return Ok(history);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHistory(int id)
    {
        try{
            await _historyService.DeleteHistory(id);
            return Ok();
        }catch(Exception){
            return BadRequest();
        }
    }
}