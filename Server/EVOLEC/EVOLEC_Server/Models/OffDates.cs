using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class OffDates
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        public DateOnly FromDate { get; set; }
        [Required]
        public DateTime ToDate { get; set; }

        public ICollection<LessonDate> LessonDates { get; set; }
    }
}
