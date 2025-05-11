namespace EVOLEC_Server.Dtos
{
    public class LessonDateUpdateDto
    {
        public string? TeacherId { get; set; }
        public string? Note { get; set; }
        public DateOnly? Date { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
    }


}
