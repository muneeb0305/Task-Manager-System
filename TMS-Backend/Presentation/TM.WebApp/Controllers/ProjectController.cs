using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.WebApp.Filter;

namespace TM.WebApp.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class ProjectController : Controller
    {
        public readonly IProjectService projectService;
        public ProjectController(IProjectService projectService)
        {
            this.projectService = projectService;
        }

        /// <summary>Admin can Get all Projects</summary>
        //Get: /api/project
        [HttpGet, Authorize(Roles = "admin")]
        public async Task<IActionResult> GetProject()
        {
            var project = await projectService.Get();
            return Ok(project);
        }

        /// <summary>Get Project by ProjectId</summary>
        //Get: /api/project/5
        [HttpGet("{ProjectId}")]
        public async Task<IActionResult> GetProject(int ProjectId)
        {
            var project = await projectService.Get(ProjectId);
            return Ok(project);
        }

        /// <summary>Admin can Create Project</summary>
        //Post: /api/project
        [HttpPost, Authorize(Roles = "admin"), ModelStateFilter]
        public async Task<IActionResult> Create([FromBody] ProjectModel project)
        {
            await projectService.Create(project);
            return Ok("Project Created");
        }

        /// <summary>Admin can Delete Project</summary>
        //Delete: /api/project/5
        [HttpDelete("{ProjectId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int ProjectId)
        {
            await projectService.Delete(ProjectId);
            return Ok("Project Removed");
        }

        /// <summary>Admin can Update Project</summary>
        //Put: /api/project/5
        [HttpPut("{ProjectId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int ProjectId, [FromBody] ProjectModel project)
        {
            await projectService.Update(ProjectId, project);
            return Ok("Project Updated" );
        }

        /// <summary>Admin can Assign Project To Team</summary>
        //Put: /api/project/assign_project
        [HttpPut("assign_project"), Authorize(Roles = "admin"), ModelStateFilter]
        public async Task<IActionResult> AssignProject([FromBody] TeamProject teamProject)
        {
            await projectService.AssignProject(teamProject);
            return Ok( "Project assigned to Team");
        }
    }
}
