using CurrencyApi.API.DTOs;

public interface IHistoryService
{
    HistoryResponseDTO RegisterHistory(HistoryRequestDTO historyDto);

    // HistoryDTO? GetHistoryDetails(int id);
    // HistoryDTO[] GetAllCurrencies();
}