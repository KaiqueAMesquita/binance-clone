public class Wallet
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Currency { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    
    public ICollection<Transaction> Transactions { get; set; }
}