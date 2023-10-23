using System.ComponentModel.DataAnnotations;

namespace TM.Buisness.Models
{
    public class CommentModel
    {
        [Required(ErrorMessage = "Comment  required")]
        public string CommentText { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
