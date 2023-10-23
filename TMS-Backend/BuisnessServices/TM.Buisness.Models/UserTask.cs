namespace TM.Buisness.Models
{
    public class UserTask
    {
        [NonZeroRequired(ErrorMessage = "User Id Required")]
        public int UserId { get; set; }

        [NonZeroRequired(ErrorMessage = "Task Id Required")]
        public int TaskId { get; set; }
    }
}
