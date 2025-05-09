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

      public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto)
    {

        var currency = _currencyRepository.GetById(id);
        if(currency == null){
            return null;
        }

        currency.Name = currencyDto.Name;
        currency.Description = currencyDto.Description;
        currency.Backing = currencyDto.Backing;
        _currencyRepository.Update(currency);


        return new CurrencyDTO
        {
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
        
        };
    }


}