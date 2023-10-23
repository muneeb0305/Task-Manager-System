using System.ComponentModel.DataAnnotations;

namespace TM.Buisness.Models
{
    public class ProjectModel
    {
        [Required(ErrorMessage = "Project Name required")]
        [StringLength(50, ErrorMessage = "Name length can't be more than 50 characters.")]
        public string Name { get; set; } = null!;

        [StringLength(200, ErrorMessage = "Description length can't be more than 200 characters.")]
        public string? Description { get; set; }
    }
}
