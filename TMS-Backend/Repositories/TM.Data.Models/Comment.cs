using System.ComponentModel.DataAnnotations;

namespace TM.Data.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        public string CommentText { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }

        // Each comment is associated with one user and one task
        public Tasks Task { get; set; } = null!;
        public int TaskId { get; set; }
        public User User { get; set; } = null!;
        public int UserId { get; set; }
    }
}
