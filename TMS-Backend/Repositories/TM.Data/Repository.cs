using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using TM.Data.Interfaces;

namespace TM.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DbContext Context;
        private readonly ILogger _logger;
        public Repository(DbContext context, ILogger logger)
        {
            Context = context;
            _logger = logger;
        }
        public async Task<T> Get(int id)
        {
            try
            {
                var getData = await Context.Set<T>().FindAsync(id);
                if (getData != null)
                {
                    _logger.LogInformation("Entity retrieved successfully.");
                    return getData;
                }
                else
                {
                    _logger.LogWarning("Entity not found with this ID");
                    return null!;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while getting the entity. ", ex.Message);
                throw;
            }
        }
        public async Task<IEnumerable<T>> GetAll()
        {
            try
            {
                var getData = await Context.Set<T>().ToListAsync();
                if (getData != null)
                {
                    _logger.LogInformation("Data retrieved successfully.");
                    return getData;
                }
                else
                {
                    _logger.LogWarning("Data not found");
                    return null!;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while getting the entity. ", ex.Message);
                throw;
            }
        }
        public IQueryable<T> Find(Expression<Func<T, bool>> predicate = null!)
        {
            var query = Context.Set<T>().AsQueryable();
            if (predicate != null)
            {
                query = query.Where(predicate);
            }
            return query;
        }
        public async Task<bool> Add(T entity)
        {
            try
            {
                await Context.Set<T>().AddAsync(entity);
                _logger.LogInformation("Entity Added");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while adding the entity. ", ex.Message);
                return false;
            }
        }
        public bool Update(T entity)
        {
            try
            {
                Context.Set<T>().Update(entity);
                _logger.LogInformation("Entity Updated");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while updating the entity. ", ex.Message);
                return false;
            }
        }
        public bool Remove(T entity)
        {
            try
            {
                Context.Set<T>().Remove(entity);
                _logger.LogInformation("Entity Removed");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while removing the entity. ", ex.Message);
                return false;
            }
        }
    }
}
