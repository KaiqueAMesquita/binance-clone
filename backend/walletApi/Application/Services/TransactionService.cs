using System.Net;
using System.Transactions;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWalletRepository _walletRepository;

    public TransactionService(ITransactionRepository transactionRepository, IWalletRepository walletRepository)
    {
        _transactionRepository = transactionRepository;
        _walletRepository = walletRepository;
    }

    public async Task<TransactionDTO> Deposit(DepositRequestDTO depositRequest)
    {   
            // Validate that the wallet exists before creating transaction
            var wallet = await _walletRepository.GetByIdAsync(depositRequest.WalletId);
            if (wallet == null)
                throw new InvalidOperationException($"Wallet with ID {depositRequest.WalletId} not found");

        var transaction = new Transaction{
            Type = TransactionType.Deposit,
            FromCurrency = "USDT",
            ToCurrency = depositRequest.Currency,
            Amount = depositRequest.Amount,
            WalletId = depositRequest.WalletId,
            DestinyWalletId = depositRequest.WalletId
        };
        
        await _transactionRepository.AddTransactionAsync(transaction);

        return new TransactionDTO
        {
            Type = transaction.Type,
            FromCurrency = transaction.FromCurrency,
            ToCurrency = transaction.ToCurrency,
            Amount = transaction.Amount,
            Status = TransactionStatus.Completed,
            WalletId = transaction.WalletId,
            DestinyWalletId = transaction.DestinyWalletId
        };
    }

    public async Task<TransactionDTO> RegisterTransaction(TransactionDTO transactionDto)
    {
        // Validate origin wallet exists
        var originWallet = await _walletRepository.GetByIdAsync(transactionDto.WalletId);
        if (originWallet == null)
            throw new KeyNotFoundException("Carteira de origem não encontrada");

        // Normalize destiny id (0 -> null)
        int? destinyId = transactionDto.DestinyWalletId == 0 ? null : transactionDto.DestinyWalletId;

        // If destiny provided, validate it exists
        if (destinyId.HasValue)
        {
            var destinyWallet = await _walletRepository.GetByIdAsync(destinyId.Value);
            if (destinyWallet == null)
                throw new KeyNotFoundException("Carteira de destino não encontrada");
        }

        var transaction = new Transaction
        {
            Type = transactionDto.Type,
            FromCurrency = transactionDto.FromCurrency,
            ToCurrency = transactionDto.ToCurrency,
            Amount = transactionDto.Amount,
            WalletId = transactionDto.WalletId,
            DestinyWalletId = destinyId
        };

        await _transactionRepository.AddTransactionAsync(transaction);

        return new TransactionDTO
        {
            Type = transaction.Type,
            FromCurrency = transaction.FromCurrency,
            ToCurrency = transaction.ToCurrency,
            Amount = transaction.Amount,
            Status = TransactionStatus.Canceled,
            WalletId = transaction.WalletId,
            DestinyWalletId = transaction.DestinyWalletId
        };
    }

    public async Task ConfirmTransaction(TransactionDTO transactionDto)
    {
        var transaction = new Transaction{
            Type = transactionDto.Type,
            FromCurrency = transactionDto.FromCurrency,
            ToCurrency = transactionDto.ToCurrency,
            Amount = transactionDto.Amount,
            Status = TransactionStatus.Completed,
            WalletId = transactionDto.WalletId,
            DestinyWalletId = transactionDto.DestinyWalletId
        };

        await _transactionRepository.UpdateAsync(transaction);
    }

    public async Task<IEnumerable<TransactionDTO>> GetByWalletIdAsync(int walletId)
    {
        // return await _transactionRepository.GetByWalletIdAsync(walletId);
        var transactions = await _transactionRepository.GetByWalletIdAsync(walletId);
        var transactionDTOs = new List<TransactionDTO>();

        foreach(var transaction in transactions)
        {
            transactionDTOs.Add(new TransactionDTO
            {
                Type = transaction.Type,
                FromCurrency = transaction.FromCurrency,
                ToCurrency = transaction.ToCurrency,
                Amount = transaction.Amount,
                Status = transaction.Status,
                WalletId = transaction.WalletId,
                DestinyWalletId = transaction.DestinyWalletId
            });
        }

        return transactionDTOs.ToArray();
    }
}