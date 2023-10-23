using System.Linq.Expressions;

namespace TM.Data.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T> Get(int id);
        Task<IEnumerable<T>> GetAll();
        IQueryable<T> Find(Expression<Func<T, bool>> predicate = null!);
        Task<bool> Add(T entity);
        bool Update(T entity);
        bool Remove(T entity);
    }
}
