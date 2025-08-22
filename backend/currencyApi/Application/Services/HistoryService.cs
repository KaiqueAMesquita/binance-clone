using Microsoft.AspNetCore.Http.HttpResults;
using CurrencyApi.API.DTOs;
using Microsoft.AspNetCore.DataProtection.Repositories;


public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _historyRepository;
    private readonly ICurrencyService _currencyService;

    public HistoryService(IHistoryRepository historyRepository, ICurrencyService currencyService)
    {
        _historyRepository = historyRepository;
        _currencyService = currencyService;
    }

    public async Task RegisterHistory(History history)
    {
        await _historyRepository.Add(history);
    }

    public async Task<HistoryDTO?> GetHistoryDetails(int id)
    {
        var history = await _historyRepository.GetById(id);
        return history != null ? new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId
        } : null;
    }

    public async Task<HistoryDTO[]> GetAllHistories()
    {
        var histories = await _historyRepository.ListAll();
        var historyDTOs = new List<HistoryDTO>();

        foreach (var history in histories)
        {
            historyDTOs.Add(new HistoryDTO
            {
                Id = history.Id,
                Datetime = history.Datetime,
                Price = history.Price,
                CurrencyId = history.CurrencyId
            });
        }

        return historyDTOs.ToArray();
    }

    public async Task<HistoryDTO?> UpdateHistory(HistoryDTO historyDto, int id)
    {
        var currency = await _currencyService.GetCurrencyById(historyDto.CurrencyId);

        var history = await _historyRepository.GetById(id);
        if (history == null)
        {
            return null;
        }

        history.Datetime = historyDto.Datetime;
        history.Price = historyDto.Price;
        history.CurrencyId = historyDto.CurrencyId;
        history.Currency = currency;

        await _historyRepository.Update(history);

        return new HistoryDTO
        {
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId
        };
    }

    public async Task DeleteHistory(int id)
    {
        var history = await _historyRepository.GetById(id);
        await _historyRepository.Delete(history);
    }
}