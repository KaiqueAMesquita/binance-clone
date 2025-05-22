public interface ICurrencyService
{
    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto);

    CurrencyDTO? GetCurrencyDetails(int id);
    CurrencyDTO[] GetAllCurrencies();

    CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencytDTO);

    Currency? GetCurrencyById(int id);
}