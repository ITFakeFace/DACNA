using EVOLEC_Server.Dtos;

public class LessonDateDto
{
    public int Id { get; set; }
    public ShortInformationTeacher Teacher { get; set; }
    public ClassRoomDTO ClassRoom { get; set; }
    public LessonDto Lesson { get; set; }
    public string? Note { get; set; }
    public DateOnly? Date { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
}
