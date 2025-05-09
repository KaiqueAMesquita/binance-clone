using Microsoft.AspNetCore.Http.HttpResults;

public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _historyRepository;

    public HistoryService(IHistoryRepository historyRepository)
    {
        _historyRepository = historyRepository;
    }

    public HistoryDTO RegisterHistory(HistoryDTO historyDto)
    {
        var history = new History 
        { 
            Datetime = DateTime.Now, 
            Price = historyDto.Price,
            Currency = history.Currency
        };
        _historyRepository.Add(history);

        return new HistoryDTO
        {
            Datetime = historyDto.Datetime, 
            Price = historyDto.Price,
            Currency = history.Currency
        };
    }

    public HistoryDTO? GetHistoryDetails(int id)
    {
        var history = _historyRepository.GetById(id);
        return history != null ? new HistoryDTO 
        { 
            Datetime = historyDto.Datetime, 
            Price = historyDto.Price,
            Currency = history.Currency      
        } : null;
    }

    public HistoryDTO[] GetAllCurrencies()
    {
        var histories = _historyRepository.ListAll();
        var historyDTOs = new List<HistoryDTO>();

        foreach(var history in histories)
        {
            historyDTOs.Add(new HistoryDTO 
            { 
                Id = history.Id, 
                Datetime = historyDto.Datetime, 
                Price = historyDto.Price,
                Currency = history.Currency
            });
        }

        return historyDTOs.ToArray();
    }

}