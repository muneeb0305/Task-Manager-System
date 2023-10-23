using System.ComponentModel.DataAnnotations;

namespace TM.Buisness.Models
{
    public class TeamModel
    {
        [Required(ErrorMessage = "Team Name Required")]
        [StringLength(50, ErrorMessage = "Team Name length can't be more than 50 characters.")]
        public string TeamName { get; set; } = null!;
    }
}
