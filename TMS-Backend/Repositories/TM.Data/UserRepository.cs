using Microsoft.Extensions.Logging;
using TM.Data.Models;

namespace TM.Data
{
    public class UserRepository : Repository<User>
    {
        public UserRepository(TaskManagerContext context, ILogger logger) : base(context, logger)
        {
        }

    }
}
