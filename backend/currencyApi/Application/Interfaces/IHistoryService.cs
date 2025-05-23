using CurrencyApi.API.DTOs;

public interface IHistoryService
{
    HistoryDTO RegisterHistory(HistoryDTO historyDto, int currencyId);
    HistoryDTO? GetHistoryDetails(int id);
    HistoryDTO[] GetAllHistories();
    HistoryDTO? UpdateHistory(HistoryDTO historyDto, int id);
    void DeleteHistory(int id);
}