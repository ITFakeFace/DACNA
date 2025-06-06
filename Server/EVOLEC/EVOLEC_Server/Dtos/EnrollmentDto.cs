namespace EVOLEC_Server.Dtos;

public class EnrollmentDto
{
    public int Id { get; set; }
    public string StudentId { get; set; }
    public int ClassRoomId { get; set; }
    public string CreatorId { get; set; }
    public DateOnly EnrollDate { get; set; }
    public int Status { get; set; }

}
