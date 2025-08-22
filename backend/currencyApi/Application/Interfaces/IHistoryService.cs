using CurrencyApi.API.DTOs;

public interface IHistoryService
{
    Task RegisterHistory(History history);
    Task<HistoryDTO?> GetHistoryDetails(int id);
    Task<HistoryDTO[]> GetAllHistories();
    Task<HistoryDTO?> UpdateHistory(HistoryDTO historyDto, int id);
    Task DeleteHistory(int id);
}