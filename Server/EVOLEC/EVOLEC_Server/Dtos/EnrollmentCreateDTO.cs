namespace EVOLEC_Server.Dtos
{
    public class EnrollmentCreateDTO
    {
        public string StudentId { get; set; }
        public int ClassRoomId { get; set; }
        public string CreatorId { get; set; }
        public DateOnly EnrollDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public int Status { get; set; } = 1; // Mặc định là 1 (đang hoạt động)
    }
}