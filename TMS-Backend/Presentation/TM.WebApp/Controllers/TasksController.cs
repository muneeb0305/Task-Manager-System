using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.WebApp.Filter;

namespace TM.WebApp.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class TasksController : Controller
    {
        private readonly ITaskService taskService;
        public TasksController(ITaskService taskService)
        {
            this.taskService = taskService;
        }

        /// <summary>Admin can Get Task by TaskId</summary>
        // GET: /api/task/5
        [HttpGet("{TaskId}")]
        public async Task<IActionResult> GetTask(int TaskId)
        {
            var task = await taskService.Get(TaskId);
            return Ok(task);
        }

        /// <summary>User can Get His by UserId</summary>
        // GET: /api/task/user/5
        [HttpGet("user/{UserId}"), Authorize(Roles = "user")]
        public async Task<IActionResult> GetUserTasks(int UserId)
        {
            var task = await taskService.GetUserTasks(UserId);
            return Ok(task);
        }

        /// <summary>Get Task by ProjectId</summary>
        // GET: /api/task/project/5
        [HttpGet("project/{ProjectId}")]
        public async Task<IActionResult> GetAllTasks(int ProjectId)
        {
            var task = await taskService.GetByProject(ProjectId);
            return Ok(task);
        }

        /// <summary>Admin can Create Task</summary>
        // POST: /api/task
        [HttpPost, Authorize(Roles = "admin"), ModelStateFilter]
        public async Task<IActionResult> Create([FromBody] TaskModel taskModel)
        {
            await taskService.Create(taskModel);
            return Ok("Task Added");
        }

        /// <summary>Admin can Delete Task</summary>
        // Delete: api/task/5
        [HttpDelete("{TaskId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int TaskId)
        {
            await taskService.Delete(TaskId);
            return Ok("Task Removed");
        }

        /// <summary>Admin can Update Task</summary>
        // Put: /api/task/5
        [HttpPut("{TaskId}")]
        public async Task<IActionResult> Update(int TaskId, [FromBody] TaskModel taskModel)
        {
            await taskService.Update(TaskId, taskModel);
            return Ok("Task Updated");
        }

        /// <summary>Admin can Assign Task to User</summary>
        // Put: /api/task/assigntask
        [HttpPut("assign_task"), Authorize(Roles = "admin"), ModelStateFilter]
        public async Task<IActionResult> AssignTask([FromBody] UserTask userTask)
        {
            await taskService.AssignTask(userTask);
            return Ok("Task Assigned");
        }
    }
}
