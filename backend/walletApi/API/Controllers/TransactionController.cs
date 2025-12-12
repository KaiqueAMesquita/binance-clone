using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    // [HttpPost]
    // public async Task<IActionResult> RegisterTransaction(TransactionDTO transactionDto)
    // {
    //     await _transactionService.RegisterTransaction(transactionDto.ToEntity());
    //     return Created("", transactionDto);
    // }

    // [HttpGet("{id}")]
    // public async Task<IActionResult> GetTransactionDetails(int id)
    // {
    //     var transaction = await _transactionService.GetTransactionDetails(id);
    //     return transaction != null ? Ok(transaction) : NotFound();
    // }

    // [HttpGet]
    // public async Task<IActionResult> GetAllHistories()
    // {
    //     var histories = await _transactionService.GetAllHistories();
    //     return Ok(histories);
    // }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> UpdateTransaction(TransactionDTO transactionDto, int id)
    // {
    //     var transaction = await _transactionService.UpdateTransaction(transactionDto, id);
    //     return Ok(transaction);
    // }
    
    // [HttpDelete("{id}")]
    // public async Task<IActionResult> DeleteTransaction(int id)
    // {
    //     try{
    //         await _transactionService.DeleteTransaction(id);
    //         return Ok();
    //     }catch(Exception){
    //         return BadRequest();
    //     }
    // }

    [HttpPost("{walletId}/transactions")]
    public async Task<ActionResult<TransactionDTO>> AddTransaction(TransactionDTO transactionDto)
    {
        try
        {
            var createdTransaction = await _transactionService.RegisterTransaction(transactionDto);
            return createdTransaction;
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
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