using System.ComponentModel.DataAnnotations;

namespace TM.Buisness.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email Required")]
        [EmailAddress(ErrorMessage = "Invalid Email Format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password Required")]
        public string Password { get; set; } = null!;

    }
}
