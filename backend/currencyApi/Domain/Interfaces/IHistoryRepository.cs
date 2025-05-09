public interface IHistoryRepository
{
    void Add(History history);
    History? GetById(int id);
    List<History>? ListAll();
    void Update(History history);
    void Delete(History history);
}