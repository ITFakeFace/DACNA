using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class LessonOffDate
    {
        public int OffDateId { get; set; }
        public OffDate OffDate { get; set; }

        public int LessonDateId { get; set; }
        public LessonDate LessonDate { get; set; }

        [Required]
        public DateOnly InitDate { get; set; }
    }
}
