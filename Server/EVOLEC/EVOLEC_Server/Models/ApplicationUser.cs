using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class ApplicationUser : IdentityUserWithTimeStamp
    {
        [Required]
        public string Fullname { get; set; }
        [MaxLength(20)]
        public string PID { get; set; }
        [Required]
        public DateOnly Dob { get; set; }
        [Required]
        public int Gender { get; set; }
        public string? Address { get; set; }


        public ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
        public ICollection<LessonDate> TeachedDates { get; set; } = new List<LessonDate>();

        public ICollection<ClassRoom> Teacher1ClassRooms { get; set; } = new List<ClassRoom>();
        public ICollection<ClassRoom> Teacher2ClassRooms { get; set; } = new List<ClassRoom>();

        public ICollection<Enrollment> StudentEnrollments { get; set; } = new List<Enrollment>();
        public ICollection<Enrollment> CreatedEnrollments { get; set; } = new List<Enrollment>();
    }
}
