public interface IHistoryService
{
    HistoryDTO RegisterHistory(HistoryDTO historyDto);

    HistoryDTO? GetHistoryDetails(int id);
    HistoryDTO[] GetAllCurrencies();
}