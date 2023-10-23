namespace TM.Buisness.Interfaces
{
    public interface IServices<T> where T : class
    {

        Task Create(T entity);
        Task Update(int entityId, T entity);
        Task Delete(int entityId);
        Task<object> Get();
        Task<object> Get(int entityId);
    }
}