using CurrencyApi.API.DTOs;

namespace CurrencyAPI.Application.Mappers
{

    public static class HistoryMapper
    {
        public static History ToEntity(this HistoryDTO dto)
        {
            return new History(
                dto.CurrencyId,
                dto.Price,
                dto.Datetime
            );
        }
    }

}