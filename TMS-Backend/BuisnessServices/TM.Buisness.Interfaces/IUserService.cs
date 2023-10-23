using TM.Buisness.Models;

namespace TM.Buisness.Interfaces
{
    public interface IUserService : IServices<UserModel>
    {
        public Task<object> AuthenticateUser(LoginModel user);
        public Task AssignTeam(UserTeam userTeam);
        public Task UnassignTeam(int UserId);
    }
}
