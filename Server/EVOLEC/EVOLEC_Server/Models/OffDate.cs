using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class OffDate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        public DateOnly FromDate { get; set; }
        [Required]
        public DateOnly ToDate { get; set; }

        public ICollection<LessonOffDate> LessonOffDates { get; set; } = new List<LessonOffDate>();
    }
}
