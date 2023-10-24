using TM.Buisness.Models;

namespace TM.Buisness.Interfaces
{
    public interface ITaskService : IServices<TaskModel>
    {
        public Task AssignTask(UserTask userTask);
        public Task<object> GetByProject(int ProjectId);
        Task<object> GetUserTasks(int UserId);
    }
}
