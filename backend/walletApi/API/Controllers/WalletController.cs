using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpPost]
    public async Task<ActionResult> CreateWallet(WalletDTO walletDto)
    {
        // try
        // {
        //     var createdWallet = await _walletService.RegisterWalletAsync(walletDto);
        //     // return CreatedAtAction(nameof(GetWallet), new { id = createdWallet.Id }, createdWallet);
        //     return Ok(createdWallet);
        // }
        // catch (InvalidOperationException ex)
        // {
        //     return Conflict(ex.Message);
        // }

        var result = await _walletService.RegisterWalletAsync(walletDto);
        return Ok(result);
    }

    [HttpPost("deposit")]
    public async Task<ActionResult<TransactionDTO>> Deposit(DepositRequestDTO depositRequest)
    {
        var deposit = await _walletService.Deposit(depositRequest);
        return Ok(deposit);
    }

    [HttpPost("transfer")]
    public async Task<ActionResult<TransactionDTO>> Transfer(TransferRequestDTO transferRequest)
    {
        var transfer = await _walletService.Transfer(transferRequest);
        return Ok(transfer);
    }

    // Update
    // ------
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, WalletDTO walletDto)
    {
        var wallet = await _walletService.UpdateWalletAsync(id, walletDto);
        if (wallet == null) return NotFound();
        return Ok(wallet);
    }

    // Delete
    // ------
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _walletService.DeleteWallet(id);
            return Ok();
        }
        catch(Exception)
        {
            return BadRequest();
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WalletDTO>>> ListAll()
    {
        var wallets = await _walletService.GetAllAsync();
        return Ok(wallets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WalletDTO>> GetById(int id)
    {
        var wallet = await _walletService.GetWalletDetailsAsync(id);
        
        if (wallet == null)
            return NotFound();
            
        return Ok(wallet);
    }
    
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<WalletDTO>>> ListAllByUser(int userId)
    {
        var wallets = await _walletService.ListAllByUserIdAsync(userId);
        return Ok(wallets);
    }
}