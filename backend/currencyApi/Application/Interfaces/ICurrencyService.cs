public interface ICurrencyService
{
    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDTOto);

    CurrencyDTO? GetCurrencyDetails(int id);
    CurrencyDTO[] GetAllCurrencies();
}