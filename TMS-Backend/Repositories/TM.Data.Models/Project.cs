using System.ComponentModel.DataAnnotations;

namespace TM.Data.Models
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; } = null!;
        [MaxLength(200)]
        public string? Description { get; set; }

        //one project is assigned to one team
        public int? TeamId { get; set; }
        public Team? Team { get; set; } = null!;

        //one project can have multiple tasks
        public ICollection<Tasks> Tasks { get; set; } = null!;
    }
}
