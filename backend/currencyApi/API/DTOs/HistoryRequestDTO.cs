namespace CurrencyApi.API.DTOs
{
    public class HistoryRequestDTO
    {
        public int Id { get; set; }
        public DateTime Datetime { get; set; }
        public double Price { get; set; }

        public int CurrencyId { get; set; }
    }
}