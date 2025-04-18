using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace EVOLEC_Server.Models
{
    public class Course : EntityWithTimeStamp
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? CourseName { get; set; }
        public string? CourseDescription { get; set; }
        [Required]
        public float BandScore { get; set; }
        [Required]
        public float PassScore { get; set; }
        [Required]
        public int Status { get; set; }

    }
}
