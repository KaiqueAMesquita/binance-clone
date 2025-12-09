public class CreateTransactionDTO
{
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public string Description { get; set; }
}