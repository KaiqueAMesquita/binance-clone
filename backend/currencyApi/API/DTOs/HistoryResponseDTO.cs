namespace CurrencyApi.API.DTOs
{
    public class HistoryResponseDTO
    {
        public int Id { get; set; }
        public DateTime Datetime { get; set; }
        public double Price { get; set; }

        public string CurrencyName { get; set; }
    }
}