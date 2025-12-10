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

    // [HttpPost]
    // public async Task<IActionResult> RegisterWallet(WalletDTO walletDto)
    // {
    //     var result = await _walletService.RegisterWallet(walletDto);
    //     return Ok(result);
    // }

    // [HttpGet("{id}")]
    // public async Task<IActionResult> GetWalletDetails(int id)
    // {
    //     var wallet = await _walletService.GetWalletDetails(id);
    //     return wallet != null ? Ok(wallet) : NotFound();
    // }

    // [HttpGet]
    // public async Task<IActionResult> GetAllWallets()
    // {
    //     var wallets = await _walletService.GetAllWallets();
    //     return Ok(wallets);
    // }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> UpdateWallet(int id, WalletDTO walletDTO)
    // {
    //     if (id != walletDTO.Id)
    //     {
    //         return BadRequest();
    //     }

    //     var wallet = await _walletService.UpdateWallet(id, walletDTO);
    //     if (wallet == null)
    //     {
    //         return NotFound();
    //     }
    //     return Ok(wallet);
    // }

    // [HttpDelete("{id}")]
    // public async Task<IActionResult> DeleteWallet(int id)
    // {
    //     try
    //     {
    //         await _walletService.DeleteWallet(id);
    //         return Ok();
    //     }
    //     catch (Exception)
    //     {
    //         return BadRequest();
    //     }
    // }
    
    // // GET api/wallets/convert?from=USD&to=EUR&amount=100
    // [HttpGet("convert")]
    // public async Task<IActionResult> Convert(string from, string to, decimal amount)
    // {
    //     var walletFrom = await _walletService.GetLastPriceBySymbolAsync(from);
    //     var walletTo = await _walletService.GetLastPriceBySymbolAsync(to);
    //     decimal conversionRate = 0;

    //     if (walletFrom.Backing == walletTo.Backing)
    //     {
    //         decimal valueFrom = walletFrom.Symbol == walletFrom.Backing
    //             ? 1 : walletFrom.Reverse
    //                 ? 1 / walletFrom.LastPrice.Value
    //                 : walletFrom.LastPrice.Value;

    //         decimal valueTo = walletTo.Symbol == walletTo.Backing
    //             ? 1 : walletTo.Reverse
    //                 ? 1 / walletTo.LastPrice.Value
    //                 : walletTo.LastPrice.Value;

    //         conversionRate = valueFrom / valueTo;
    //     }

    //     decimal value = amount * conversionRate;

    //     var ret = new
    //     {
    //         From = walletFrom,
    //         To = walletTo,
    //         Amount = amount,
    //         Rate = conversionRate,
    //         Value = value,
    //     };


    //     return Ok(ret);
    // }

    // [HttpGet("summary")]
    // public async Task<IActionResult> GetSummaries()
    // {
    //     var result = await _walletService.GetWalletSummariesAsync();
    //     return Ok(result);
    // }
    
    // [HttpGet("{id}/chart")]
    // public async Task<IActionResult> GetChart(int id, int quantity)
    // {
    //     var chartData = await _walletService.GetChartDataAsync(id, quantity);
    //     return Ok(chartData);
    // }

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

    // Update
    // ------
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id)
    {
        return Ok();  
    }

    // Delete
    // ------
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Wallet>>> ListAll()
    {
        var wallets = await _walletService.GetAllAsync();
        return Ok(wallets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Wallet>> GetById(int id)
    {
        var wallet = await _walletService.GetWalletDetailsAsync(id);
        
        if (wallet == null)
            return NotFound();
            
        return Ok(wallet);
    }
    
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Wallet>>> ListAllByUser(int userId)
    {
        var wallets = await _walletService.ListAllByUserIdAsync(userId);
        return Ok(wallets);
    }
}