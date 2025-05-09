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

    public CurrencyDTO? GetCurrencyDetails(int id)
    {
        var currency = _currencyRepository.GetById(id);
        return currency != null ? new CurrencyDTO 
        { 
            Name = currency.Name, 
            Description = currency.Description,
            Backing = currency.Backing,          
        } : null;
    }

    public CurrencyDTO[] GetAllCurrencies()
    {
        var currencys = _currencyRepository.ListAll();
        var currencyDTOs = new List<CurrencyDTO>();

        foreach(var currency in currencys)
        {
            currencyDTOs.Add(new CurrencyDTO 
            { 
                Id = currency.Id, 
                Name = currency.Name, 
                Description = currency.Description,
                Backing = currency.Backing,
                
            });
        }

        return currencyDTOs.ToArray();
    }

}