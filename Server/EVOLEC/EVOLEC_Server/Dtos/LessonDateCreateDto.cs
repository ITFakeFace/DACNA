namespace EVOLEC_Server.Dtos
{
    public class LessonDateCreateDto
    {
        public string TeacherId { get; set; }
        public int ClassRoomId { get; set; }
        public int LessonId { get; set; }
        public string? Note { get; set; }
        public DateOnly? Date { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
    }

}
