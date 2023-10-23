namespace TM.Buisness.Models
{
    public class TeamProject
    {
        [NonZeroRequired(ErrorMessage = "Project Id Required")]
        public int ProjectId { get; set; }

        [NonZeroRequired(ErrorMessage = "Team Id Required")]
        public int TeamId { get; set; }
    }
}
