public interface ICurrencyRepository
{
    void Add(User user);
    User? GetById(int id);
    List<Currency>? ListAll();
    void Update(User user);
    void Delete(User user);
    Currency? GetByEmail(string email);
}