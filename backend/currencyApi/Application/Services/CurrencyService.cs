using Microsoft.AspNetCore.Http.HttpResults;
using CurrencyApi.API.DTOs;
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
            Symbol = currencyDto.Symbol,
            Name = currencyDto.Name,
            Description = currencyDto.Description,
            Backing = currencyDto.Backing,
        };
        _currencyRepository.Add(currency);

        return new CurrencyDTO
        {
            Symbol = currency.Symbol,
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
            Id = currency.Id,
            Symbol = currency.Symbol,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
            Histories = (currency.Histories ?? new List<History>()).
            Select(h => new HistoryDTO
            {
                Id = h.Id,
                Datetime = h.Datetime,
                Price = h.Price,
                CurrencyId = h.CurrencyId
            }).ToList()
        } : null;
    }

    public CurrencyDTO[] GetAllCurrencies()
    {
        var currencies = _currencyRepository.ListAll();
        var currencyDTOs = new List<CurrencyDTO>();

        foreach (var currency in currencies)
        {
            currencyDTOs.Add(new CurrencyDTO
            {
                Id = currency.Id,
                Symbol = currency.Symbol,
                Name = currency.Name,
                Description = currency.Description,
                Backing = currency.Backing,
                Histories = (currency.Histories ?? new List<History>()).
                    Select(h => new HistoryDTO
                    {
                        Id = h.Id,
                        Datetime = h.Datetime,
                        Price = h.Price,
                        CurrencyId = h.CurrencyId
                    }).ToList()
            });
        }

        return currencyDTOs.ToArray();
    }

    public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto)
    {

        var currency = _currencyRepository.GetById(id);
        if (currency == null)
        {
            return null;
        }

        currency.Symbol = currencyDto.Symbol;
        currency.Name = currencyDto.Name;
        currency.Description = currencyDto.Description;
        currency.Backing = currencyDto.Backing;
        _currencyRepository.Update(currency);


        return new CurrencyDTO
        {
            Symbol = currency.Symbol,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,

        };
    }

    public Currency? GetCurrencyById(int id)
    {
        var currency = _currencyRepository.GetById(id);
        if (currency == null)
        {
            return null;
        }
        return currency;

    } 
}