using Microsoft.Extensions.Logging;
using TM.Data.Interfaces;
using TM.Data.Models;

namespace TM.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly TaskManagerContext _context;
        private readonly ILogger<UnitOfWork> logger;
        public UnitOfWork(TaskManagerContext context, ILogger<UnitOfWork> Logger)
        {
            _context = context;
            logger = Logger;
        }

        public IRepository<Comment> CommentRepository => new CommentRepository(_context, logger);
        public IRepository<Tasks> TaskRepository => new TaskRepository(_context, logger);
        public IRepository<User> UserRepository => new UserRepository(_context, logger);
        public IRepository<Team> TeamRepository => new TeamRepository(_context, logger);
        public IRepository<Project> ProjectRepository => new ProjectRepository(_context, logger);

        public async Task Commit()
        {
            await _context.SaveChangesAsync();
        }
        public void Dispose()
        {
            _context.DisposeAsync();
        }
    }
}
