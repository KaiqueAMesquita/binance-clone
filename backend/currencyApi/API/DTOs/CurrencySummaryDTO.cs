namespace CurrencyAPI.API.DTOs
{
    public class CurrencySummaryDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = default!;
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public decimal Change { get; set; }
    }

}