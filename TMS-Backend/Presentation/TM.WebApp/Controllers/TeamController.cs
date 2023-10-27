using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.WebApp.Filter;

namespace TM.WebApp.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class TeamController : Controller
    {
        private readonly ITeamService teamService;
        public TeamController(ITeamService teamService)
        {
            this.teamService = teamService;
        }

        /// <summary>Admin can Get All Teams</summary>
        // GET: /api/team
        [HttpGet, Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllTeam()
        {
            var team = await teamService.Get();
            return Ok(team);
        }

        /// <summary>User can Get his Team</summary>
        // GET: /api/team
        [HttpGet("user/{UserId}"), Authorize(Roles = "user")]
        public async Task<IActionResult> GetUserTeam(int UserId)
        {
            var team = await teamService.GetUserTeam(UserId);
            return Ok(team);
        }

        /// <summary>Get Team by TeamId</summary>
        //GET: /api/team/5
        [HttpGet("{TeamId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> GetTeam(int TeamId)
        {
            var team = await teamService.Get(TeamId);
            return Ok(team);
        }

 
        /// <summary>Get Team Users by Team Id</summary>
        // GET: /api/team/users/5
        [HttpGet("users/{TeamId}")]
        public async Task<IActionResult> GetTeamUser(int TeamId)
        {
            var team = await teamService.GetTeamUsers(TeamId);
            return Ok(team);
        }

        /// <summary>Admin can Create Team</summary>
        // POST: /api/team
        [HttpPost, Authorize(Roles = "admin"), ModelStateFilter]
        public async Task<IActionResult> Create([FromBody] TeamModel team)
        {
            await teamService.Create(team);
            return Ok("Team Added");
        }

        /// <summary>Admin can Update Team</summary>
        // Put: /api/user/5
        [HttpPut("{TeamId}"), Authorize(Roles = "admin"), ModelStateFilter]
        public async Task<IActionResult> Update(int TeamId, [FromBody] TeamModel team)
        {
            await teamService.Update(TeamId, team);
            return Ok("Team Updated");
        }

        /// <summary>Admin can Delete Team</summary>
        // Delete: api/team/5
        [HttpDelete("{TeamId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int TeamId)
        {
            await teamService.Delete(TeamId);
            return Ok("Team Removed");
        }
    }
}
