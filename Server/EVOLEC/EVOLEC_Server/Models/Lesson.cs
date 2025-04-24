using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class Lesson
    {
        [Key]
        public int Id { get; set; }
        // CoursId
        public int CourseId { get; set; }
        [Required]
        public required Course Course { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        [Required]
        public required string Description { get; set; }
        [Required]
        public required string ContentBeforeClass { get; set; }
        [Required]
        public required string ContentDuringClass { get; set; }
        [Required]
        public required string ContentAfterClass { get; set; }
        [Required]
        public int Status { get; set; } = 1;

        public ICollection<LessonDate> LessonDates { get; set; } = new List<LessonDate>();
    }
}
