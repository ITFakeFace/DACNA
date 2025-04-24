using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVOLEC_Server.Models
{
    public class Enrollment : EntityWithTimeStamp
    {
        [Key]
        public int Id { get; set; }
        // StudentId
        public string StudentId { get; set; }
        [Required]
        [ForeignKey(nameof(StudentId))]
        public ApplicationUser Student { get; set; }

        public int ClassRoomId { get; set; }
        [Required]
        public ClassRoom ClassRoom { get; set; }

        public string CreatorId { get; set; }
        [Required]
        [ForeignKey(nameof(CreatorId))]
        public ApplicationUser Creator { get; set; }

        [Required]
        public DateOnly EnrollDate { get; set; }

        [Required]
        public int Status { get; set; } = 1;

    }
}
