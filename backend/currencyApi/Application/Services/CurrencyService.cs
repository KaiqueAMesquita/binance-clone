using Microsoft.AspNetCore.Http.HttpResults;

public class Currency : ICurrency
{
    private readonly ICurrencyRepository _CurrencyRepository;

    public Currency(ICurrencyRepository CurrencyRepository)
    {
        _CurrencyRepository = CurrencyRepository;
    }

    public CurrencyDTO RegisterCurrency(CurrencyDTO CurrencyDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(CurrencyDto.Password);

        var Currency = new Currency 
        { 
            Name = CurrencyDto.Name, 
            Email = CurrencyDto.Email,
            Phone = CurrencyDto.Phone,
          
        };
        _CurrencyRepository.Add(Currency);

        return new CurrencyDTO
        {
            Name = Currency.Name,
            Email = Currency.Email,
            Phone = Currency.Phone,
           
        };
    }

    public CurrencyDTO? GetCurrencyDetails(int id)
    {
        var Currency = _CurrencyRepository.GetById(id);
        return Currency != null ? new CurrencyDTO 
        { 
            Name = Currency.Name, 
            Email = Currency.Email,
            Phone = Currency.Phone,
          
        } : null;
    }

    public CurrencyDTO[] GetAllCurrencys()
    {
        var Currencys = _CurrencyRepository.ListAll();
        var CurrencyDTOs = new List<CurrencyDTO>();

        foreach(var Currency in Currencys)
        {
            CurrencyDTOs.Add(new CurrencyDTO 
            { 
                Id = Currency.Id, 
                Name = Currency.Name, 
                Email = Currency.Email,
                Phone = Currency.Phone,
              
            });
        }

        return CurrencyDTOs.ToArray();
    }
    
     public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO CurrencyDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(CurrencyDto.Password);

        var Currency = _CurrencyRepository.GetById(id);
        if(Currency == null){
            return null;
        }

        Currency.Name = CurrencyDto.Name;
        Currency.Email = CurrencyDto.Email;
        Currency.Phone = CurrencyDto.Phone;
     
        _CurrencyRepository.Update(Currency);

        return new CurrencyDTO
        {
            Name = Currency.Name,
            Email = Currency.Email,
            Phone = Currency.Phone,
           
        };
    }

    public void DeleteCurrency(int id)
    {
        var Currency = _CurrencyRepository.GetById(id);
        _CurrencyRepository.Delete(Currency);
    }

    public CurrencyDTO? ValidateCurrency(string email, string password)
    {
        var Currency = _CurrencyRepository.GetByEmail(email);
        if(Currency == null || !BCrypt.Net.BCrypt.Verify(password, Currency.Password))
        {
            return null;
        }

        return new CurrencyDTO
        {
            Id = Currency.Id,
            Name = Currency.Name,
            Email = Currency.Email,
            Phone = Currency.Phone,
   
        };
    }
}