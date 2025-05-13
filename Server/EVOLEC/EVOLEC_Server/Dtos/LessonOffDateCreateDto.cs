namespace EVOLEC_Server.Dtos
{
    public class LessonOffDateCreateDto
    {
        public int LessonDateId { get; set; }
        public int OffDateId { get; set; }
        public DateOnly InitDate { get; set; }
    }
}
