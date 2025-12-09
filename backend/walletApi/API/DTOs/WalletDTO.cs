public class WalletDTO
{
    // public int Id { get; set; }
    // public string Symbol { get; set; }
    // public string Name { get; set; }
    // public string Description { get; set; }
    // public string Backing { get; set; }
    // public bool Reverse { get; set; } = false;

    // public ICollection<HistoryDTO> Histories { get; set; }

    public int Id { get; set; }
    public int UserId { get; set; }
    public string Currency { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}