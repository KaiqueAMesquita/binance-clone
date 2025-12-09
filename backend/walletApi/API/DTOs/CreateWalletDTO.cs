public class CreateWalletDTO
{
    public int UserId { get; set; }
    public string Currency { get; set; }
    public decimal InitialBalance { get; set; } = 0;
}