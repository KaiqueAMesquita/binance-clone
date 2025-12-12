public class TransferRequestDTO
{
    public string FromCurrency { get; set; }
    public string ToCurrency { get; set; }
    public decimal Amount { get; set; }
    
    public int WalletId { get; set; }

    public int DestinyWalletId { get; set; }
}