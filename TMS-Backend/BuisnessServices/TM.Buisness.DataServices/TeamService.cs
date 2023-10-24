using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TM.Buisness.CustomErrors;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.Data.Interfaces;
using TM.Data.Models;

namespace TM.Buisness.DataServices
{
    public class TeamService : Errors, ITeamService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public TeamService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        //Create Team
        public async Task Create(TeamModel team)
        {
            //Validations
            var teamExist = await unitOfWork.TeamRepository.Find(t => t.TeamName == team.TeamName).FirstOrDefaultAsync();
            Validate(teamExist != null, "Team already exist with this name");

            //Create Team
            var teamEntity = mapper.Map<Team>(team);
            var teamToAdd = await unitOfWork.TeamRepository.Add(teamEntity);
            if (teamToAdd)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To create team");
            }
        }

        //Update Team
        public async Task Update(int TeamId, TeamModel team)
        {
            var teamExist = await unitOfWork.TeamRepository.Get(TeamId);

            //Not Found
            NotFound(teamExist == null, "Invalid Team ID");

            //Validations 
            var sameTeam = await unitOfWork.TeamRepository.Find(t => t.TeamName == team.TeamName).FirstOrDefaultAsync();
            Validate(sameTeam != null, "Team already exist with this name");

            //Update Team
            teamExist!.TeamName = team.TeamName;
            var teamEntity = mapper.Map<Team>(teamExist);
            var updatedTeam = unitOfWork.TeamRepository.Update(teamExist);
            if (updatedTeam)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed to update Team");
            }
        }

        //Delete Team
        public async Task Delete(int TeamId)
        {
            var removeTeam = await unitOfWork.TeamRepository.Get(TeamId);
            var _teamTaks = await unitOfWork.TeamRepository.Find(t => t.TeamId == TeamId).Include(t=>t.Project).ThenInclude(p=>p.Tasks).FirstOrDefaultAsync();
            var tasks = _teamTaks?.Project?.Tasks;
            //Not Found
            NotFound(removeTeam == null, "Invalid Team ID");
            if (tasks?.Count >0 && tasks != null)
            {
                foreach (var _tasks in tasks!)
                {
                    _tasks.AssignedUserID = null;
                }
            }
            
            //Delete team
            var team = unitOfWork.TeamRepository.Remove(removeTeam!);
            if (team)
            {

                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed to delete team");
            }
        }

        //Get Teams
        public async Task<object> Get()
        {
            var teams = await unitOfWork.TeamRepository.Find().Include(t => t.UsersWorking).Include(t => t.Project).ToListAsync();
            var teamInfo = teams.Select(team => new
            {
                id = team.TeamId,
                teamName = team.TeamName,
                assignedProject = team.Project?.Name == null ? "No Project Assigned" : team.Project.Name,
                totalUsers = team.UsersWorking != null ? team.UsersWorking.Count : 0
            });
            return teamInfo;
        }

        //Get Team by TeamId
        public async Task<object> Get(int TeamId)
        {
            var team = await unitOfWork.TeamRepository.Find(t => t.TeamId == TeamId).Include(t => t.UsersWorking).Include(t => t.Project).FirstOrDefaultAsync();

            //Not Found
            NotFound(team == null, "Invalid Team ID");

            var teaminfo = new
            {
                id = TeamId,
                teamName = team!.TeamName,
                assignedProject = team.Project?.Name == null ? "No Project Assigned" : team.Project.Name,
                users = team.UsersWorking != null ? team.UsersWorking.Count : 0,
            };
            return teaminfo;
        }
        
        //Get Team User by Team id
        public async Task<object> GetTeamUsers(int Teamid)
        {
            var team = await unitOfWork.TeamRepository.Find(t => t.TeamId == Teamid).Include(t => t.UsersWorking).FirstOrDefaultAsync();
            //Not Found
            NotFound(team == null, "Invalid Team ID");
            var users = team!.UsersWorking?.Select(u => new
            {
                Id = u.UserId,
                userName = u.UserName,
                email = u.Email

            });
            return users!;
        }
    }
}
