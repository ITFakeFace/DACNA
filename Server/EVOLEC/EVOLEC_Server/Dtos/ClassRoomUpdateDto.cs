namespace EVOLEC_Server.Dtos
{
    public class ClassRoomUpdateDto
    {
        public string? Teacher1Id { get; set; }
        public string? Teacher2Id { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int? Status { get; set; } = 0;
        public int? Shift { get; set; }
    }
}
