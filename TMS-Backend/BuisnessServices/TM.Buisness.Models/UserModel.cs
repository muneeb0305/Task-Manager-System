using System.ComponentModel.DataAnnotations;

namespace TM.Buisness.Models
{
    public class UserModel
    {
        [Required(ErrorMessage = "Username Required")]
        [StringLength(50, ErrorMessage = "Name length can't be more than 50 characters.")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Email Required")]
        [EmailAddress(ErrorMessage = "Inavalid email format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password Required")]
        [MinLength(8, ErrorMessage = "Password should be atleast 8 character")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Role Required")]
        public string Role { get; set; } = null!;
    }
}
