using TM.Buisness.Models;

namespace TM.Buisness.Interfaces
{
    public interface ICommentService : IServices<CommentModel>
    {
        Task Create(int TaskId, CommentModel entity);
        Task<object> GetByTask(int TaskId);
    }
}
