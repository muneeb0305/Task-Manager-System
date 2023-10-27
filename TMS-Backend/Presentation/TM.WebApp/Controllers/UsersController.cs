using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.WebApp.Filter;

namespace TM.WebApp.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class UsersController : Controller
    {
        private readonly IUserService userService;
        public UsersController(IUserService userService)
        {
            this.userService = userService;
        }

        /// <summary>Admin cas see All Users</summary>
        // GET: /api/user
        [HttpGet, Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await userService.Get();
            return Ok(users);
        }

        /// <summary>Get User By Id</summary>
        //GET: /api/user/5
        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetUser(int UserId)
        {
            var user = await userService.Get(UserId);
            return Ok(user);
        }

        /// <summary>Admin can Create User</summary>
        // POST: /api/user
        [HttpPost, Authorize(Roles = "admin")]
        [ModelStateFilter]
        public async Task<IActionResult> Create([FromBody] UserModel user)
        {
            await userService.Create(user);
            return Ok("User Added");
        }

        /// <summary>Update User</summary>
        // Put: /api/user/5
        [HttpPut("{UserId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int UserId, [FromBody] UserModel user)
        {
            await userService.Update(UserId, user);
            return Ok("User Updated");
        }

        /// <summary>Admin can Delete User</summary>
        // Delete: api/delete/5
        [HttpDelete("{UserId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int UserId)
        {
            await userService.Delete(UserId);
            return Ok("User Removed");
        }

        /// <summary>Admin Can Assign Team to User</summary>
        // Put: api/user/5
        [HttpPut("assign_team"), Authorize(Roles = "admin")]
        [ModelStateFilter]
        public async Task<IActionResult> Assignteam([FromBody] UserTeam userTeam)
        {
            await userService.AssignTeam(userTeam);
            return Ok("Assign Team to User");
        }

        /// <summary>Admin Can remove user from Team</summary>
        // Put: api/user/5
        [HttpDelete("remove_team/{UserId}"), Authorize(Roles = "admin")]
        [ModelStateFilter]
        public async Task<IActionResult> UnassignTeam(int UserId)
        {
            await userService.UnassignTeam(UserId);
            return Ok("User Remove From Team");
        }

    }
}
