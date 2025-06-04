namespace EVOLEC_Server.Dtos
{
    public class OffDateUpdateDto
    {
        public string Name { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public string? TeacherId { get; set; }
        public int Status { get; set; }
    }
}
