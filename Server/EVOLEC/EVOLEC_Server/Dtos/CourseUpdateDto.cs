using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Dtos
{
    public class CourseUpdateDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public float FullScore { get; set; }
        public float PassScore { get; set; }
        public float BandScore { get; set; }
        public string CreatorId { get; set; }
        public int Status { get; set; }
    }
}
