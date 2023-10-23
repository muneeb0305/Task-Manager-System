using TM.Buisness.Models;

namespace TM.Buisness.Interfaces
{
    public interface IProjectService : IServices<ProjectModel>
    {
        Task AssignProject(TeamProject teamProject);
    }
}
