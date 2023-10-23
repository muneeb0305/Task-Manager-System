using System.ComponentModel.DataAnnotations;

namespace TM.Data.Models
{
    public class Tasks
    {
        [Key]
        public int TaskId { get; set; }
        [Required, MaxLength(50)]
        public string TaskName { get; set; } = null!;
        [MaxLength(200)]
        public string? TaskDescription { get; set; }
        public DateTime DueDate { get; set; }
        public Status Status { get; set; }

        //one task associates with one project
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        //one task can be done by one user
        public int? AssignedUserID { get; set; }
        public User? AssignedUser { get; set; } 

        //one task can have many comments
        public ICollection<Comment> Comments { get; set; } = null!;

    }
}
