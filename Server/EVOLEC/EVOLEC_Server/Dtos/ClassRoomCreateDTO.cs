using EVOLEC_Server.Models;

namespace EVOLEC_Server.Dtos
{
    public class ClassRoomCreateDTO
    {
        public string? Teacher1Id { get; set; }
        public string? Teacher2Id { get; set; }
        public string CreatorId { get; set; }   
        public int CourseId { get; set; }
        public DateOnly? StartDate { get; set; }
        public int RoomId { get; set; }
        public int Status { get; set; } = 1;
        public int? Shift { get; set; }
    }
}
