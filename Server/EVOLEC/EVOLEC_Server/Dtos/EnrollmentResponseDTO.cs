namespace EVOLEC_Server.Dtos
{
    public class EnrollmentResponseDTO
    {
        public int EnrollmentId { get; set; }
        public int ClassRoomId { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public string CreatorId { get; set; }
        public string CreatorName { get; set; }
        public string ClassRoomName { get; set; }
        public DateOnly EnrollDate { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}