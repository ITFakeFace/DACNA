namespace EVOLEC_Server.Dtos
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string CourseName { get; set; }
        public string? CourseDescription { get; set; }
        public float BandScore { get; set; }
        public float PassScore { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
