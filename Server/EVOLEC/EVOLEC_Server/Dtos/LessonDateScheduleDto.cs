namespace EVOLEC_Server.Dtos
{
    public class LessonDateScheduleDto
    {
        public int Id { get; set; }
        public string? TeacherId { get; set; }
        public string? TeacherName { get; set; }
        public int? ClassRoomId { get; set; }
        public int? LessonId { get; set; }
        public string? LessonName { get; set; }
        public string? Note { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
    }
}
