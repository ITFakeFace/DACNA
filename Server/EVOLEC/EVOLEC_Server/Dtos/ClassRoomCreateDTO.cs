using EVOLEC_Server.Models;

namespace EVOLEC_Server.Dtos
{
    public class ClassRoomCreateDTO
    {
        public int Id { get; set; }
        public string? Teacher1Id { get; set; }
        public string? Teacher2Id { get; set; }
        public string? Teacher1Name { get; set; }
        public string? Teacher2Name { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public string CreatorId { get; set; }
        public string CreatorName { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int Status { get; set; } = 0;
        public int? Shift { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
