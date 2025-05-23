using CurrencyApi.API.DTOs;

public interface IHistoryService
{
    HistoryDTO RegisterHistory(HistoryDTO historyDto, int currencyId);
    HistoryDTO? GetHistoryDetails(int id);
    HistoryDTO[] GetAllHistories();
    void DeleteHistory(int id);
}