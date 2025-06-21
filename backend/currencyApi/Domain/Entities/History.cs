using System.Text.Json.Serialization;

public class History
{
    public History(int currencyId, decimal price, DateTime datetime)
    {
        CurrencyId = currencyId;
        Price = price;
        Datetime = datetime;
    }

    public int Id { get; set; }
    public DateTime Datetime { get; set; }
    public decimal Price { get; set; }

    public int CurrencyId { get; set; }

    [JsonIgnore]
    public Currency Currency { get; set; }
}