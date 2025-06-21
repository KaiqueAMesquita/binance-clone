using Microsoft.AspNetCore.Http.HttpResults;
using CurrencyApi.API.DTOs;
using CurrencyAPI.API.DTOs;
public class CurrencyService : ICurrencyService
{
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public async Task<CurrencyDTO> RegisterCurrency(CurrencyDTO currencyDto)
    {
        var currency = new Currency
        {
            Symbol = currencyDto.Symbol,
            Name = currencyDto.Name,
            Description = currencyDto.Description,
            Backing = currencyDto.Backing,
        };
        await _currencyRepository.Add(currency);

        return new CurrencyDTO
        {
            Symbol = currency.Symbol,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
        };
    }

    public async Task<CurrencyDTO?> GetCurrencyDetails(int id)
    {
        var currency = await _currencyRepository.GetById(id);
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

    public async Task<CurrencyDTO[]> GetAllCurrencies()
    {
        var currencies = await _currencyRepository.ListAll();
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

    public async Task<CurrencyDTO?> UpdateCurrency(int id, CurrencyDTO currencyDto)
    {

        var currency = await _currencyRepository.GetById(id);
        if (currency == null)
        {
            return null;
        }

        currency.Symbol = currencyDto.Symbol;
        currency.Name = currencyDto.Name;
        currency.Description = currencyDto.Description;
        currency.Backing = currencyDto.Backing;
        await _currencyRepository.Update(currency);


        return new CurrencyDTO
        {
            Symbol = currency.Symbol,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,

        };
    }

    public async Task DeleteCurrency(int id)
    {
        var currency = await _currencyRepository.GetById(id);
        await _currencyRepository.Delete(currency);
    }

    // Retorna Entity Currency para usar no HistoryService
    public async Task<Currency?> GetCurrencyById(int id)
    {
        var currency = await _currencyRepository.GetById(id);
        if (currency == null)
        {
            return null;
        }
        return currency;

    } 

    public async Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol)
    {
        return await _currencyRepository.GetLastPriceBySymbolAsync(symbol);
    }

    public async Task<IEnumerable<CurrencySummaryDto>> GetCurrencySummariesAsync()
    {
        return await _currencyRepository.GetCurrencySummariesAsync();
    }

    public async Task<IEnumerable<ChartPointDto>> GetChartDataAsync(int currencyId, int quantity)
    {
        return await _currencyRepository.GetChartDataAsync(currencyId, quantity);
    }
}