using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.WebApp.Filter;

namespace TM.WebApp.Controllers
{
    [Route("api/[controller]"), AllowAnonymous]
    public class LoginController : ControllerBase
    {
        private readonly IUserService userService;

        public LoginController(IUserService userService)
        {
            this.userService = userService;
        }

        /// <summary>Login</summary>
        //Post: /api/login
        [HttpPost]
        [ModelStateFilter]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {
            var token = await userService.AuthenticateUser(user);
            return Ok(token);
        }
    }
}
