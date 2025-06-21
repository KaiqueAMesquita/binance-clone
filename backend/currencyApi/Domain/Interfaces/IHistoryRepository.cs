public interface IHistoryRepository
{
    Task Add(History history);
    Task<History?> GetById(int id);
    Task<IEnumerable<History?>> ListAll();
    Task Update(History history);
    Task Delete(History history);
}