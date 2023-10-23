using Microsoft.Extensions.Logging;
using TM.Data.Models;

namespace TM.Data
{
    public class CommentRepository : Repository<Comment>
    {
        public CommentRepository(TaskManagerContext context, ILogger logger) : base(context, logger)
        {
        }
    }
}
