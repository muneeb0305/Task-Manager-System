using Microsoft.Extensions.Logging;
using TM.Data.Models;

namespace TM.Data
{
    public class TeamRepository : Repository<Team>
    {
        public TeamRepository(TaskManagerContext context, ILogger logger) : base(context, logger)
        {
        }

    }
}
