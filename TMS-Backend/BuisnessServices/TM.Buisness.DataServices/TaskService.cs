using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TM.Buisness.CustomErrors;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.Data.Interfaces;
using TM.Data.Models;

namespace TM.Buisness.DataServices
{
    public class TaskService : Errors, ITaskService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public TaskService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }
        //Create Task
        public async Task Create(TaskModel task)
        {
            var project = await unitOfWork.ProjectRepository.Get(task.ProjectId);
            //Not Found
            NotFound(project == null, "Project Not Found");

            // Add Task
            var taskEntity = mapper.Map<Tasks>(task);
            var taskToAdd = await unitOfWork.TaskRepository.Add(taskEntity);
            if (taskToAdd)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To create task");
            }

        }
        //Delete Task
        public async Task Delete(int id)
        {
            var removeTask = await unitOfWork.TaskRepository.Get(id);

            //Not Found
            NotFound(removeTask == null, "Task Not Found");

            var taskToRemove = unitOfWork.TaskRepository.Remove(removeTask!);

            if (taskToRemove)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To delete task");
            }
        }
        //Update Task
        public async Task Update(int taskId, TaskModel task)
        {
            // if task and project not found
            var taskToUpdate = await unitOfWork.TaskRepository.Get(taskId);
            NotFound(taskToUpdate == null, "Task not found.");
            var project = await unitOfWork.ProjectRepository.Get(task.ProjectId);
            NotFound(project == null, "Project not found.");
            var VerifyTask = taskToUpdate!.ProjectId;
            NotFound(VerifyTask != task.ProjectId, $"Task ID: {taskId} not found in {project!.Name}");

            //Validate Data
            Validate(!string.IsNullOrEmpty(task.TaskName) && task.TaskName.Length > 50, "Task Name should be less than 50 character");
            Validate(!string.IsNullOrEmpty(task.TaskDescription) && task.TaskDescription.Length > 200, "Task Description should be less than 200 character");
            Validate(task.Status != Status.Pending && task.Status != Status.InProcess && task.Status != Status.Completed, $"Status Should be:\n{Status.InProcess}\n{Status.Pending}\n{Status.Completed}");

            if (!string.IsNullOrEmpty(task.TaskName))
            {
                taskToUpdate.TaskName = task.TaskName;
            }
            if (!string.IsNullOrEmpty(task.TaskDescription))
            {
                taskToUpdate.TaskDescription = task.TaskDescription;
            }
            if (task.DueDate != DateTime.MinValue)
            {
                taskToUpdate.DueDate = task.DueDate;
            }
            if (task.Status == Status.Pending || task.Status == Status.InProcess || task.Status == Status.Completed)
            {
                taskToUpdate.Status = task.Status;
            }
            var taskEntity = mapper.Map<Tasks>(taskToUpdate);
            var updatedTask = unitOfWork.TaskRepository.Update(taskEntity);
            if (updatedTask)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To update task");
            }
        }
        //Assign Task
        public async Task AssignTask(UserTask userTask)
        {
            var user = await unitOfWork.UserRepository.Get(userTask.UserId);
            var task = await unitOfWork.TaskRepository
                .Find(t => t.TaskId == userTask.TaskId)
                .Include(t => t.Project)
                .ThenInclude(p => p.Team)
                .ThenInclude(t => t!.UsersWorking)
                .FirstOrDefaultAsync();

            //If user and task not found 
            NotFound(user == null, "User not found.");
            NotFound(task == null, "Task not found.");
            var userExistInTeam = task!.Project?.Team?.UsersWorking?.Any(u => u.UserId == userTask.UserId);
            NotFound(userExistInTeam == false, $"User {user!.UserName} is not a part of the team assigned to the project.");
            NotFound(userExistInTeam == null, $"Project doesn't assigned to the team.");

            //Assign Task
            task.AssignedUserID = userTask.UserId;
            var taskEntity = mapper.Map<Tasks>(task);
            var updatedTask = unitOfWork.TaskRepository.Update(taskEntity);
            if (updatedTask)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To assign task");
            }
        }

        //Get Task by id
        public async Task<object> Get(int TaskId)
        {
            var allTasks = await unitOfWork.TaskRepository
                .Find(t => t.TaskId == TaskId)
                .Include(t => t.Project)
                .ThenInclude(p => p.Team)
                .ThenInclude(t => t!.UsersWorking)
                .Include(t => t.AssignedUser)
                .FirstOrDefaultAsync();
            NotFound(allTasks == null, "Task Not Found");
            var taskDetail = new
            {
                id = allTasks!.TaskId,
                teamId = allTasks.Project.TeamId,
                projectName = allTasks.Project.Name,
                taskName = allTasks.TaskName,
                description = allTasks.TaskDescription,
                status = allTasks.Status.ToString(),
                assignedTo = allTasks.AssignedUser?.UserName,
                assinedTeam = allTasks.Project.Team?.TeamName,
                dueDate = allTasks.DueDate.ToString("yyyy-MM-dd"),
            };
            return taskDetail;
        }

        //Get all tasks by project ID
        public async Task<object> GetByProject(int ProjectId)
        {
            var project = await unitOfWork.ProjectRepository.Get(ProjectId);
            //If project not Found
            NotFound(project == null, "Project not found.");

            var allTasks = await unitOfWork.TaskRepository
                .Find(t => t.ProjectId == ProjectId)
                .Include(t => t.AssignedUser)
                .Include(t => t.Comments)
                .Include(t => t.Project)
                .ToListAsync();

            var taskDetail = allTasks.Select(allTasks => new
            {
                id = allTasks.TaskId,
                projectName = allTasks.Project.Name,
                taskName = allTasks.TaskName,
                description = allTasks.TaskDescription,
                status = allTasks.Status.ToString(),
                assignedTo = allTasks.AssignedUser?.UserName,
                comments = allTasks.Comments.Count,
                dueDate = allTasks.DueDate.ToString("yyyy-MM-dd"),
            });
            return taskDetail;
        }

        public Task<object> Get()
        {
            throw new NotImplementedException();
        }

        public async Task<object> GetUserTasks(int UserId)
        {
            var user = await unitOfWork.UserRepository.Find(u => u.UserId == UserId).Include(u => u.AssignedTask)!.ThenInclude(t => t.Project).ThenInclude(p => p.Team).FirstOrDefaultAsync();
            NotFound(user == null, "User Not Found");

            var userTasks = user!.AssignedTask?.Select(t => new
            {
                id = t.TaskId,
                teamId = t.Project.TeamId,
                projectName = t.Project.Name,
                taskName = t.TaskName,
                description = t.TaskDescription,
                status = t.Status.ToString(),
                assignedTo = t.AssignedUser?.UserName,
                assinedTeam = t.Project.Team?.TeamName,
                dueDate = t.DueDate.ToString("yyyy-MM-dd"),
            });
            return userTasks!;
        }
    }
}
