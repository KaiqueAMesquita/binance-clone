using Microsoft.AspNetCore.Http.HttpResults;
using CurrencyApi.API.DTOs;


public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _historyRepository;
    private readonly ICurrencyService _currencyService;

    public HistoryService(IHistoryRepository historyRepository, ICurrencyService currencyService)
    {
        _historyRepository = historyRepository;
        _currencyService = currencyService;
    }

    public HistoryDTO RegisterHistory(HistoryDTO historyDto, int currencyId)
    {
        var currency = _currencyService.GetCurrencyById(currencyId);
        if (currency == null)
        {
            throw new ArgumentException("Currency não encontrada");
        }

        var history = new History
        {
            Datetime = DateTime.Now,
            Price = historyDto.Price,
            CurrencyId = currency.Id,
            Currency = currency
        };
        _historyRepository.Add(history);

        return new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId
        };
    }

    public HistoryDTO? GetHistoryDetails(int id)
    {
        var history = _historyRepository.GetById(id);
        return history != null ? new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId
        } : null;
    }

    public HistoryDTO[] GetAllHistories()
    {
        var histories = _historyRepository.ListAll();
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

    public HistoryDTO? UpdateHistory(HistoryDTO historyDto, int id)
    {
        var currency = _currencyService.GetCurrencyById(historyDto.CurrencyId);

        var history = _historyRepository.GetById(id);
        if (history == null)
        {
            return null;
        }

        history.Datetime = historyDto.Datetime;
        history.Price = historyDto.Price;
        history.CurrencyId = historyDto.CurrencyId;
        history.Currency = currency;

        _historyRepository.Update(history);

        return new HistoryDTO
        {
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId
        };
    }

    public void DeleteHistory(int id)
    {
        var history = _historyRepository.GetById(id);
        _historyRepository.Delete(history);
    }

}