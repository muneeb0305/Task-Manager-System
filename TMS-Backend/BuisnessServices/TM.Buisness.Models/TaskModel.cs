using System.ComponentModel.DataAnnotations;
using TM.Data.Models;

namespace TM.Buisness.Models
{
    public class TaskModel
    {
        [Required(ErrorMessage = "Task Name required")]
        [StringLength(50, ErrorMessage = "Name length can't be more than 50 characters.")]
        public string TaskName { get; set; } = null!;

        [StringLength(200, ErrorMessage = "Description length can't be more than 200 characters.")]
        public string? TaskDescription { get; set; }

        [DateRequired(ErrorMessage = "The deadline must be today's date or later.")]
        [DataType(DataType.Date)]
        public DateTime DueDate { get; set; }

        [Required(ErrorMessage = "Task Status required")]
        [Range(0, 2, ErrorMessage = "Enter valid Status 0:Pending, 1:Process, 2:Completed")]
        public Status Status { get; set; }

        [Required(ErrorMessage = "Project Id required")]
        public int ProjectId { get; set; }
    }

    public class DateRequired : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is DateTime date)
            {
                if (date != DateTime.MinValue)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
