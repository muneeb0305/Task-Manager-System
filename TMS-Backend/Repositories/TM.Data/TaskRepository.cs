using Microsoft.Extensions.Logging;
using TM.Data.Models;

namespace TM.Data
{
    public class TaskRepository : Repository<Tasks>
    {
        public TaskRepository(TaskManagerContext context, ILogger logger) : base(context, logger)
        {
        }
    }
}
