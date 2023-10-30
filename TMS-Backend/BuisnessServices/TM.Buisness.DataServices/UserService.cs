using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TM.Buisness.CustomErrors;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.Data.Interfaces;
using TM.Data.Models;

namespace TM.Buisness.DataServices
{
    public class UserService : Errors, IUserService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public UserService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.configuration = configuration;
            this.mapper = mapper;
        }

        //Athenticate User
        public async Task<object> AuthenticateUser(LoginModel user)
        {
            var findUser = await unitOfWork.UserRepository.Find(c => c.Email.ToLower() == user.Email.ToLower()).FirstOrDefaultAsync();

            // Check Errors
            NotFound(findUser == null, "User Not Found with this email.");
            Validate(!BCrypt.Net.BCrypt.Verify(user!.Password, findUser!.Password), "Password Incorrect");

            //Generate token
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.NameIdentifier, findUser.UserId.ToString()),
                new Claim(ClaimTypes.Role, findUser.Role)
            };

            var config = configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Key"]!));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                audience: config["Audience"],
                issuer: config["Issuer"],
                expires: DateTime.Now.AddHours(1),
                signingCredentials: cred
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        //Create User
        public async Task Create(UserModel user)
        {

            var emailExist = await unitOfWork.UserRepository.Find(u => u.Email == user.Email).FirstOrDefaultAsync();
            Validate(emailExist != null, "Email already exist");
            //Convert role to lower case
            string userRole = user.Role.ToLower();
            Validate(!string.Equals(userRole, "admin", StringComparison.Ordinal) && !string.Equals(userRole, "user", StringComparison.Ordinal), "Invalid Role. Role should be Admin or User");

            //Make Password Hash
            string _passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Password = _passwordHash;
            var userEntity = mapper.Map<User>(user);
            var userAdd = await unitOfWork.UserRepository.Add(userEntity);
            if (userAdd)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("User Creation Failed");
            }
        }

        //Delete User
        public async Task Delete(int Userid)
        {
            var removeUser = await unitOfWork.UserRepository.Get(Userid);
            // If user Not Found
            NotFound(removeUser == null, "User Not Found");

            var userToremove = unitOfWork.UserRepository.Remove(removeUser!);
            if (userToremove)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("User Deletion Failed");
            }
        }

        //Update User
        public async Task Update(int UserId, UserModel user)
        {
            var userUpdate = await unitOfWork.UserRepository.Get(UserId);
            // If Not Found
            NotFound(userUpdate == null, "User Not Found");

            //Validate Data
            Validate(!string.IsNullOrWhiteSpace(user.UserName) && user.UserName.Length > 50, "User Name should be less than or equal to 50 characters");
            Validate(!string.IsNullOrWhiteSpace(user.Email) && user.Email.Length > 50, "Email should be less than or equal to 50 characters");

            if (!string.IsNullOrWhiteSpace(user.UserName))
            {
                userUpdate!.UserName = user.UserName;
            }
            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                if(userUpdate!.Email == user.Email)
                {
                    userUpdate!.Email = user.Email;
                }
                else
                {
                    var emailExist = await unitOfWork.UserRepository.Find(u => u.Email == user.Email).FirstOrDefaultAsync();
                    Validate(emailExist!=null, "Email already exist");
                    userUpdate!.Email = user.Email;
                }
            }
            if (!string.IsNullOrWhiteSpace(user.Password))
            {
                string _passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
                userUpdate!.Password = _passwordHash;
            }
            if (!string.IsNullOrWhiteSpace(user.Role))
            {
                Validate(!string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase) && !string.Equals(user.Role, "user", StringComparison.OrdinalIgnoreCase), "Invalid Role");
                userUpdate!.Role = user.Role.ToLower();
            }
            var userEntity = mapper.Map<User>(userUpdate);
            var userUpdated = unitOfWork.UserRepository.Update(userEntity!);
            if (userUpdated)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("User Updation Failed");
            }
        }

        //Get by ID
        public async Task<object> Get(int UserId)
        {
            var user = await unitOfWork.UserRepository.Find(u => u.UserId == UserId).Include(u => u.Team).FirstOrDefaultAsync();
            // If user Not Found
            NotFound(user == null, "User Not Found");
            var userInfo = new
            {
                id = user!.UserId,
                userName = user.UserName,
                email = user.Email,
                role = user.Role,
                assignedTeam = user.Team?.TeamName == null ? "Team is Not Assigned" : user.Team.TeamName,
            };
            return userInfo;
        }

        //Get All Users
        public async Task<object> Get()
        {
            var allUsers = await unitOfWork.UserRepository.Find().Include(u => u.Team).ToListAsync();
            var userInfo = allUsers.Select(user => new
            {
                id = user.UserId,
                userName = user.UserName,
                email = user.Email,
            });
            return userInfo;
        }
        // Assign Team
        public async Task AssignTeam(UserTeam userTeam)
        {
            var user = await unitOfWork.UserRepository.Get(userTeam.UserId);
            var team = await unitOfWork.TeamRepository.Get(userTeam.TeamId);
            NotFound(user == null, "User Not Found");
            NotFound(team == null, "Team Not Found");

            user!.Team = team;
            var userEntity = mapper.Map<User>(user);
            var assignTeam = unitOfWork.UserRepository.Update(userEntity);
            if (assignTeam)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed to Assign team to User");
            }
        }

        public async Task UnassignTeam(int UserId)
        {

            var user = await unitOfWork.UserRepository.Find(u => u.UserId == UserId).Include(u=>u.AssignedTask).FirstOrDefaultAsync();
            NotFound(user == null, "User Not Found");

            user!.TeamId = null;
            var tasks = user.AssignedTask;
            if (tasks != null)
            {

                foreach (var task in user.AssignedTask!)
                {
                    task.AssignedUserID = null;
                }
            }
            var userEntity = mapper.Map<User>(user);
            var unassignTeam = unitOfWork.UserRepository.Update(userEntity);
            if (unassignTeam)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed to remove user from team");
            }
        }
    }
}
