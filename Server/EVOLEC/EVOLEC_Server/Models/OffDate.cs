﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Required]
        public int Status { get; set; }

        public string? TeacherId { get; set; }

        [ForeignKey("TeacherId")]
        public ApplicationUser? Teacher { get; set; }

        public ICollection<LessonOffDate> LessonOffDates { get; set; } = new List<LessonOffDate>();
    }
}
