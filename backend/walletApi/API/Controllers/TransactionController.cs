using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    // 1. Precisamos injetar o WalletService para poder mover o dinheiro
    private readonly IWalletService _walletService;

    public TransactionController(ITransactionService transactionService, IWalletService walletService)
    {
        _transactionService = transactionService;
        _walletService = walletService;
    }

    [HttpPost("{walletId}/transactions")]
    public async Task<ActionResult<TransactionDTO>> AddTransaction(int walletId, TransactionDTO transactionDto)
    {
        try
        {
            if (transactionDto == null) transactionDto = new TransactionDTO();
            
            // Garante que o ID da rota seja usado
            transactionDto.WalletId = walletId;

            // --- A CORREÇÃO ESTÁ AQUI ---
            // Verifica se é uma transferência/conversão (tem carteira de destino?)
            if (transactionDto.DestinyWalletId != null && transactionDto.DestinyWalletId > 0)
            {
                // Chama o WalletService.Transfer, que contém a lógica de:
                // Subtrair saldo da origem, converter valor e somar no destino.
                var transferResult = await _walletService.Transfer(transactionDto);
                return Ok(transferResult);
            }

            // Se não tiver destino, é apenas um registro simples (ex: histórico manual)
            var createdTransaction = await _transactionService.RegisterTransaction(transactionDto);
            return Ok(createdTransaction);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno", details = ex.Message });
        }
    }

    [HttpGet("{walletId}/transactions")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions(int walletId)
    {
        try
        {
            var transactions = await _transactionService.GetByWalletIdAsync(walletId);
            return Ok(transactions);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}