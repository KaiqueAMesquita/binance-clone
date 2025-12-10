
public class TransactionDTO
{
    // public int Id { get; set; }
    // public DateTime Datetime { get; set; }
    // public decimal Price { get; set; }

    // public int CurrencyId { get; set; }

    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public string FromCurrency { get; set; }
    public string ToCurrency { get; set; }
    public decimal Amount { get; set; }
    public string TransactionHash { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.Completed;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int WalletId { get; set; }

    // public int destinyWalletId { get; set; }
}

public enum TransactionType
{
    Deposit,
    Withdrawal,
    Transfer,
    Purchase,
    Sale,
    Fee
}

public enum TransactionStatus
{
    Pending,
    Completed,
    Failed,
    Canceled
}