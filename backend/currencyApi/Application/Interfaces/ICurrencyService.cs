public interface ICurrencyService
{
    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDTOto);

    CurrencyDTO? GetCurrencyDetails(int id);
    CurrencyDTO[] GetAllCurrencies();

    CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencytDTO);
}