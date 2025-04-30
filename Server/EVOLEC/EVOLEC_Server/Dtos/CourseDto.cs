using EVOLEC_Server.Models;

namespace EVOLEC_Server.Dtos
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        public float PassScore { get; set; }
        public float FullScore { get; set; }
        public float BandScore { get; set; }

        public int Status { get; set; }
        public string CreatorId { get; set; }
        public ShortInformationUser Creator { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
