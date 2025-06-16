namespace EVOLEC_Server.Dtos
{
    public class ClassRoomAffectedDto
    {
        public int ClassRoomId { get; set; }
        public string ClassRoomName { get; set; }
        public int LessonId { get; set; }
        public string Lesson { get; set; }
        public string TeacherId { get; set; }
        public string Teacher { get; set; }
        public DateOnly? Date { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public int? RoomId { get; set; }
        public string? RoomName { get; set; }
    }
}
