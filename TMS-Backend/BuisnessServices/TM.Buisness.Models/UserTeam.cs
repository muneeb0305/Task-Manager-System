using System.ComponentModel.DataAnnotations;

namespace TM.Buisness.Models
{
    public class UserTeam
    {
        [NonZeroRequired(ErrorMessage = "User Id Required")]
        public int UserId { get; set; }

        [NonZeroRequired(ErrorMessage = "Team Id Required")]
        public int TeamId { get; set; }
    }
    public class NonZeroRequiredAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is int intValue && intValue != 0)
            {
                return true;
            }

            return false;
        }
    }

}
