public class GetCurrencyDetailsUseCase
{
    private readonly ICurrencyService _CurrencyService;

    public GetCurrencyDetailsUseCase(ICurrencyService CurrencyService)
    {
        _currencyService = CurrencyService;
    }

    public CurrencyDTO? Execute(int id) => _currencyService.GetCurrencyDetails(id);
}
