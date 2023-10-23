using TM.Data.Models;

namespace TM.Data.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<User> UserRepository { get; }
        IRepository<Project> ProjectRepository { get; }
        IRepository<Tasks> TaskRepository { get; }
        IRepository<Team> TeamRepository { get; }
        IRepository<Comment> CommentRepository { get; }

        Task Commit();

    }
}
