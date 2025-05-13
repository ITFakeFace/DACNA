namespace EVOLEC_Server.Dtos
{
    public class LessonOffDateUpdateDto
    {
        public int LessonDateId { get; set; }
        public int OffDateId { get; set; }
        public DateOnly InitDate { get; set; }
    }
}
