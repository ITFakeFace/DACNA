namespace EVOLEC_Server.DTOs.Lesson
{
    public class LessonUpdateDto
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ContentBeforeClass { get; set; }
        public string ContentDuringClass { get; set; }
        public string ContentAfterClass { get; set; }
        public int Status { get; set; }
    }
}
