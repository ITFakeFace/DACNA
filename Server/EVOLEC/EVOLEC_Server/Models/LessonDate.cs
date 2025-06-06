﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVOLEC_Server.Models
{
    public class LessonDate
    {
        [Key]
        public int Id { get; set; }

        // TeacherId
        public string TeacherId { get; set; }
        [Required]
        public ApplicationUser Teacher { get; set; }

        // ClassRoomId
        public int ClassRoomId { get; set; }
        [Required]
        public ClassRoom ClassRoom { get; set; }

        //LessonId
        public int LessonId { get; set; }
        [Required]
        public Lesson Lesson { get; set; }

        public string? Note { get; set; }
        public DateOnly? Date { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }

        public int RoomId { get; set; }
        [Required]
        public Room Room { get; set; }

        public ICollection<LessonOffDate> LessonOffDates { get; set; } = new List<LessonOffDate>();
        public ICollection<StudentAttendance> studentAttendances { get; set; } = new List<StudentAttendance>();


    }
}
