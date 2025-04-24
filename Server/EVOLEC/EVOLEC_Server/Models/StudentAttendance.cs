using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class StudentAttendance
    {
        // StudentId
        public string StudentId { get; set; }
        [Required]
        public ApplicationUser Student { get; set; }

        // LessonDateId
        public int LessonDateId { get; set; }
        [Required]
        public LessonDate LessonDate { get; set; }

        public string? Note { get; set; }

        [Required]
        public int Status { get; set; } = 1;

    }
}
