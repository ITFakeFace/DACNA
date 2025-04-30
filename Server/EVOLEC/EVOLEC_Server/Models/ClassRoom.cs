using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVOLEC_Server.Models
{
    public class ClassRoom : EntityWithTimeStamp
    {
        [Key]
        public int Id { get; set; }

        public string? Teacher1Id { get; set; }
        [ForeignKey(nameof(Teacher1Id))]
        public ApplicationUser? Teacher1 { get; set; }

        public string? Teacher2Id { get; set; }
        [ForeignKey(nameof(Teacher2Id))]
        public ApplicationUser? Teacher2 { get; set; }

        public int CourseId { get; set; }
        [Required]
        public Course Course { get; set; }

        [Required]
        public string CreatorId { get; set; }
        [Required]
        [ForeignKey(nameof(CreatorId))]
        public ApplicationUser Creator { get; set; }

        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        [Required]
        public int Status { get; set; } = 1;
        public int? Shift { get; set; }

        public ICollection<LessonDate> LessonDates { get; set; } = new List<LessonDate>();
        public ICollection<Enrollment> StudentEnrollments { get; set; } = new List<Enrollment>();
        public ICollection<Enrollment> CreatorEnrollments { get; set; } = new List<Enrollment>();

    }
}
