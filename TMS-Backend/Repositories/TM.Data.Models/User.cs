using System.ComponentModel.DataAnnotations;

namespace TM.Data.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;

        //One User has one team
        public int? TeamId { get; set; }       //Foreign Key
        public Team? Team { get; set; }

        //one user can have multiple Tasks
        public ICollection<Tasks>? AssignedTask { get; set; }
    }
}
