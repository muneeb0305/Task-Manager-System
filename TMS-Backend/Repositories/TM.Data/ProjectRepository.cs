using Microsoft.Extensions.Logging;
using TM.Data.Models;

namespace TM.Data
{
    public class ProjectRepository : Repository<Project>
    {
        public ProjectRepository(TaskManagerContext context, ILogger logger) : base(context, logger)
        {
        }
    }
}
