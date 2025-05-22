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

    public HistoryResponseDTO RegisterHistory(HistoryRequestDTO historyDto)
    {
        
        var currency = _currencyService.GetCurrencyById(historyDto.CurrencyId);
        if (currency == null)
        {
            throw new ArgumentException("Currency não encontrada");
        }


        var history = new History
        {
            Datetime = DateTime.Now,
            Price = historyDto.Price,
            Currency = currency
        };
        _historyRepository.Add(history);

        return new HistoryResponseDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyName = currency.Name
        };
        
    
    }

    // public HistoryResponseDTO? GetHistoryDetails(int id)
    // {
    //     var history = _historyRepository.GetById(id);
    //     return history != null ? new HistoryDTO 
    //     { 
    //         Id = history.Id,
    //         Datetime = history.Datetime,
    //         Price = history.Price,
    //         Currency = history.Currency      
    //     } : null;
    // }

    // public HistoryResponseDTO[] GetAllCurrencies()
    // {
    //     var histories = _historyRepository.ListAll();
    //     var historyDTOs = new List<HistoryResponseDTO>();

    //     foreach(var history in histories)
    //     {
    //         historyDTOs.Add(new HistoryResponseDTO 
    //         { 
    //             Id = history.Id, 
    //             Datetime = history.Datetime, 
    //             Price = history.Price,
    //             Currency = history.Currency
    //         });
    //     }

    //     return historyDTOs.ToArray();
    // }

}