namespace EVOLEC_Server.Dtos;

public class EnrollmentDto
{
    public int Id { get; set; }
    public ShortInformationUser Student { get; set; }
    public ClassRoomShortInfomation ClassRoom { get; set; }
    public ShortInformationUser Creator { get; set; }
    public DateOnly EnrollDate { get; set; }
    public int Status { get; set; }

}
