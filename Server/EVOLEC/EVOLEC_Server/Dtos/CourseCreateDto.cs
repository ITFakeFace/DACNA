using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Dtos
{
    public class CourseCreateDto
    {
        [Required]
        public string CourseName { get; set; }
        public string? CourseDescription { get; set; }
        [Required]
        public float BandScore { get; set; }
        [Required]
        public float PassScore { get; set; }
        [Required]
        public int Status { get; set; }
    }
}
