using AutoMapper;
using TM.Buisness.Models;
using TM.Data.Models;

namespace TM.Buisness.DataServices
{
    public class BuisnessEntityMapping : Profile
    {
        public BuisnessEntityMapping()
        {
            CreateMap<UserModel, User>();
            CreateMap<TeamModel, Team>();
            CreateMap<ProjectModel, Project>();
            CreateMap<TaskModel, Tasks>();
            CreateMap<CommentModel, Comment>();
        }
    }
}
