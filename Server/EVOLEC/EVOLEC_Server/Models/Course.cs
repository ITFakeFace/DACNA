using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace EVOLEC_Server.Models
{
    public class Course : EntityWithTimeStamp
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public float? PassScore { get; set; }
        [Required]
        public float FullScore { get; set; }
        [Required]
        public float BandScore { get; set; }
        [Required]
        public int Tuition { get; set; }
        [Required]
        public int Status { get; set; } = 1;

        [Required]
        public ApplicationUser Creator { get; set; }
        [Required]
        [ForeignKey(nameof(Creator))]
        public string CreatorId { get; set; }

        public ICollection<ClassRoom> ClassRooms { get; set; }
        public ICollection<Lesson> Lessons { get; set; }

    }
}
