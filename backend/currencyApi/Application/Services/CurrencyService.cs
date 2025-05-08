using Microsoft.AspNetCore.Http.HttpResults;

public class CurrencyService : ICurrencyService
{
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto)
    {

        var currency = new Currency 
        { 
            Name = currencyDto.Name, 
            Description = currencyDto.Description,
            Backing = currencyDto.Backing,
     
        };
        _currencyRepository.Add(currency);

        return new CurrencyDTO
        {
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,

        };
    }

}