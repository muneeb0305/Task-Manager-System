using System.ComponentModel.DataAnnotations;

namespace TM.Data.Models
{
    public class Team
    {
        [Key]
        public int TeamId { get; set; }
        [MaxLength(50)]
        public string TeamName { get; set; } = null!;

        // One project is assigned to One team
        public Project? Project { get; set; }

        // Many users can be in the team
        public ICollection<User>? UsersWorking { get; set; }
    }
}
