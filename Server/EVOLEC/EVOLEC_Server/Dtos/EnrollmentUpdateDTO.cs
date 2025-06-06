using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Dtos
{
    public class EnrollmentUpdateDTO
    {
        [Required]
        public string StudentId { get; set; }

        [Required]
        public int ClassRoomId { get; set; }

        [Required]
        public DateOnly EnrollDate { get; set; }

        [Required]
        public int Status { get; set; }
    }

}