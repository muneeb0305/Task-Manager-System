using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TM.Buisness.CustomErrors;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.Data.Interfaces;
using TM.Data.Models;


namespace TM.Buisness.DataServices
{
    public class ProjectService : Errors, IProjectService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public ProjectService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }
        //Create Project
        public async Task Create(ProjectModel project)
        {
            var projectEntity = mapper.Map<Project>(project);
            var projectToAdd = await unitOfWork.ProjectRepository.Add(projectEntity);

            if (projectToAdd)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Project Creation failed");
            }
        }
        //Delete Project
        public async Task Delete(int ProjectId)
        {
            var removeProject = await unitOfWork.ProjectRepository.Get(ProjectId);

            //Not Found
            NotFound(removeProject == null, "Project Not Found");

            var remove = unitOfWork.ProjectRepository.Remove(removeProject!);
            if (remove)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Project Deletion Failed");
            }

        }
        //Update Project
        public async Task Update(int Projectid, ProjectModel project)
        {
            var ProjectToUpdate = await unitOfWork.ProjectRepository.Get(Projectid);

            //Not Found
            NotFound(ProjectToUpdate == null, "Project Not Found");

            //Validations
            Validate(!string.IsNullOrEmpty(project.Name) && project.Name.Length > 50, "Project Name should be less than 50 character");
            Validate(!string.IsNullOrEmpty(project.Description) && project.Description.Length > 200, "Project Description should be less than 200 character");

            if (!string.IsNullOrEmpty(project.Name))
            {
                ProjectToUpdate!.Name = project.Name;
            }
            if (!string.IsNullOrEmpty(project.Description))
            {
                ProjectToUpdate!.Description = project.Description;
            }

            //Update
            var projectEntity = mapper.Map<Project>(ProjectToUpdate);
            var updatedProject = unitOfWork.ProjectRepository.Update(projectEntity!);
            if (updatedProject)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Project Updation Failed");
            }
        }
        //Assign Project
        public async Task AssignProject(TeamProject teamProject)
        {
            var team = await unitOfWork.TeamRepository.Find(t => t.TeamId == teamProject.TeamId).Include(t => t.Project).FirstOrDefaultAsync();
            var project = await unitOfWork.ProjectRepository.Find(p => p.ProjectId == teamProject.ProjectId).Include(p => p.Tasks).FirstOrDefaultAsync();

            //Not Found
            NotFound(team == null, "Team Not Found");
            NotFound(project == null, "Project Not Found");
            Validate(team!.Project?.TeamId != null, "Team is already working with another project");

            //Assign project to team
            project!.Team = team;
            var projectEntity = mapper.Map<Project>(project);
            var updatedProject = unitOfWork.ProjectRepository.Update(projectEntity);
            if (updatedProject)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Project assigning to team Failed");
            }
        }
        //Get All Projects
        public async Task<object> Get()
        {
            var allProjects = await unitOfWork.ProjectRepository.Find().Include(p => p.Tasks).Include(p => p.Team).ToListAsync();
            var project = allProjects.Select(p => new
            {
                Id = p.ProjectId,
                projectName = p.Name,
                assignedTo = p.Team == null ? "No Team Assigned" : p.Team.TeamName
            });
            return project;
        }
        //Get Project By ID
        public async Task<object> Get(int ProjectId)
        {
            var project = await unitOfWork.ProjectRepository.Find(p => p.ProjectId == ProjectId).Include(p => p.Tasks).Include(p => p.Team).FirstOrDefaultAsync();

            //Not Found
            NotFound(project == null, "Project Not Found");

            var projectInfo = new
            {
                Id = project!.ProjectId,
                projectName = project.Name,
                description = project.Description,
                assignedTo = project.Team == null ? "No Team Assigned" : project.Team.TeamName,
                totalTasks = project.Tasks.Count,
                taskPending = project.Tasks.Count(t => t.Status == Status.Pending),
                taskInProcess = project.Tasks.Count(t => t.Status == Status.InProcess),
                taskCompleted = project.Tasks.Count(t => t.Status == Status.Completed),
            };
            return projectInfo;
        }

        public async Task<object> GetUserProject(int UserId)
        {
            var user = await unitOfWork.UserRepository.Find(u => u.UserId == UserId).FirstOrDefaultAsync();
            //Not Found
            NotFound(user == null, "User Not Found");

            var userTeam = await unitOfWork.TeamRepository.Find(t => t.TeamId == user!.TeamId).FirstOrDefaultAsync();
            //Not Found
            if (userTeam == null)
            {
                return new object[] { };
            }

            var project = await unitOfWork.ProjectRepository.Find(p => p.TeamId == userTeam!.TeamId).Include(p => p.Tasks).Include(p => p.Team).ToArrayAsync();
            if (project == null)
            {
                return new object[] { };
            }
            var projectInfo = project.Select(project => new
            {
                Id = project!.ProjectId,
                projectName = project.Name,
                description = project.Description,
                assignedTo = project.Team == null ? "No Team Assigned" : project.Team.TeamName,
                totalTasks = project.Tasks.Count,
                taskPending = project.Tasks.Count(t => t.Status == Status.Pending),
                taskInProcess = project.Tasks.Count(t => t.Status == Status.InProcess),
                taskCompleted = project.Tasks.Count(t => t.Status == Status.Completed),
            });
            return projectInfo;
        }
    }
}
