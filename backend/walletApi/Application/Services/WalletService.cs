// Clean single WalletService implementation
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks; // Adicionei para garantir compatibilidade

public class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepository;
    private readonly ITransactionService _transactionService;
    private readonly ICurrencyClient _currencyClient;

    public WalletService(IWalletRepository walletRepository, ITransactionService transactionService, ICurrencyClient currencyClient)
    {
        _walletRepository = walletRepository;
        _transactionService = transactionService;
        _currencyClient = currencyClient;
    }

    public async Task<WalletDTO> RegisterWalletAsync(WalletDTO walletDto)
    {
        var wallet = new Wallet { Currency = walletDto.Currency, Balance = 0, UserId = walletDto.UserId };
        var existing = await _walletRepository.GetByUserAndCurrencyAsync(wallet.UserId, wallet.Currency);
        if (existing != null) throw new InvalidOperationException("Wallet already exists");
        
        await _walletRepository.AddAsync(wallet);
        
        // CORREÇÃO: Adicionado Id = wallet.Id
        return new WalletDTO { Id = wallet.Id, Currency = wallet.Currency, Balance = wallet.Balance, UserId = wallet.UserId };
    }

    public async Task<WalletDTO?> UpdateWalletAsync(int id, WalletDTO walletDto)
    {
        var wallet = await _walletRepository.GetByIdAsync(id);
        if (wallet == null) return null;

        wallet.Currency = walletDto.Currency;
        wallet.Balance = walletDto.Balance;
        wallet.UserId = walletDto.UserId;

        await _walletRepository.UpdateAsync(wallet);
        
        return new WalletDTO { Id = wallet.Id, Currency = wallet.Currency, Balance = wallet.Balance, UserId = wallet.UserId, CreatedAt = wallet.CreatedAt, UpdatedAt = wallet.UpdatedAt };
    }

    public async Task<TransactionDTO> Deposit(DepositRequestDTO depositRequest)
    {
        var transactionDto = await _transactionService.Deposit(depositRequest);
        if (transactionDto.DestinyWalletId == null) throw new InvalidOperationException("Destiny wallet not specified");

        var receiver = await _walletRepository.GetByIdAsync(transactionDto.DestinyWalletId.Value);
        if (receiver == null) throw new KeyNotFoundException("Receiver wallet not found");
        
        receiver.Balance += transactionDto.Amount;

        await _walletRepository.UpdateAsync(receiver);

        return transactionDto;
    }

    public async Task<TransactionDTO> Transfer(TransferRequestDTO transferRequest)
    {
        var sender = await _walletRepository.GetByIdAsync(transferRequest.WalletId);
        var receiver = await _walletRepository.GetByIdAsync(transferRequest.DestinyWalletId);
        if (sender == null || receiver == null) throw new KeyNotFoundException("Sender or receiver not found");
        if (sender.Balance < transferRequest.Amount) throw new InvalidOperationException("Insufficient funds");

        var conversionValue = transferRequest.Amount;

        if (!string.Equals(sender.Currency, receiver.Currency, StringComparison.OrdinalIgnoreCase))
        {
            var conversion = await _currencyClient.ConvertAsync(sender.Currency, receiver.Currency, transferRequest.Amount);
            if (conversion == null) throw new InvalidOperationException("Conversion failed");

            conversionValue = conversion.Value;
        }

        sender.Balance -= transferRequest.Amount;
        receiver.Balance += conversionValue;

        await _walletRepository.UpdateAsync(sender);
        await _walletRepository.UpdateAsync(receiver);

        var created = await _transactionService.Transfer(transferRequest);
        if (created.DestinyWalletId == null) throw new InvalidOperationException("Destiny wallet not specified");

        return created;
    }

    public async Task DeleteWallet(int id)
    {
        var wallet = await _walletRepository.GetByIdAsync(id);
        await _walletRepository.DeleteAsync(wallet);
    }

    public async Task<IEnumerable<WalletDTO?>> GetAllAsync()
    {
        var wallets = await _walletRepository.ListAllAsync();
        var list = wallets.Select(w => new WalletDTO
        {
            Id = w.Id, // <--- CORREÇÃO: Adicionado o ID aqui
            Currency = w.Currency,
            Balance = w.Balance,
            UserId = w.UserId,
            Transactions = (w.Transactions ?? new List<Transaction>()).Select(t => new TransactionDTO
            {
                Id = t.Id, // Pode ser útil adicionar ID na transação também se precisar
                Type = t.Type,
                FromCurrency = t.FromCurrency,
                ToCurrency = t.ToCurrency,
                Amount = t.Amount,
                Status = t.Status,
                WalletId = t.WalletId,
                DestinyWalletId = t.DestinyWalletId
            }).ToList()
        }).ToList();
        return list;
    }

    public async Task<WalletDTO?> GetWalletDetailsAsync(int id)
    {
        var wallet = await _walletRepository.GetByIdAsync(id);
        if (wallet == null) return null;
        return new WalletDTO
        {
            Id = wallet.Id, // <--- CORREÇÃO: Adicionado o ID aqui
            Currency = wallet.Currency,
            Balance = wallet.Balance,
            UserId = wallet.UserId,
            Transactions = (wallet.Transactions ?? new List<Transaction>()).Select(t => new TransactionDTO
            {
                Type = t.Type,
                FromCurrency = t.FromCurrency,
                ToCurrency = t.ToCurrency,
                Amount = t.Amount,
                Status = t.Status,
                WalletId = t.WalletId,
                DestinyWalletId = t.DestinyWalletId
            }).ToList()
        };
    }

    public async Task<IEnumerable<WalletDTO?>> ListAllByUserIdAsync(int userId)
    {
        var wallets = await _walletRepository.ListAllByUserIdAsync(userId);
        var list = wallets.Select(w => new WalletDTO
        {
            Id = w.Id, // <--- CORREÇÃO CRÍTICA: Adicionado o ID aqui (era esse que quebrava o saque)
            Currency = w.Currency,
            Balance = w.Balance,
            UserId = w.UserId,
            Transactions = (w.Transactions ?? new List<Transaction>()).Select(t => new TransactionDTO
            {
                Type = t.Type,
                FromCurrency = t.FromCurrency,
                ToCurrency = t.ToCurrency,
                Amount = t.Amount,
                Status = t.Status,
                WalletId = t.WalletId,
                DestinyWalletId = t.DestinyWalletId
            }).ToList()
        }).ToList();
        return list;
    }
}