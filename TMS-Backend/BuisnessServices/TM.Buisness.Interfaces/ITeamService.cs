using TM.Buisness.Models;

namespace TM.Buisness.Interfaces
{
    public interface ITeamService : IServices<TeamModel>
    {
        public Task<object> GetTeamUsers(int Teamid);
    }
}
