using EVOLEC_Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Dtos
{
        public class ClassRoomDTO
        {
            public ShortInformationTeacher? Teacher1 { get; set; }
            public ShortInformationTeacher Teacher2 { get; set; }
            public ShortInformationTeacher Creator { get; set; } 
            public CourseDto Course { get; set; }
            public DateOnly? StartDate { get; set; }
            public DateOnly? EndDate { get; set; }
            public int Status { get; set; } = 0;
            public int? Shift { get; set; }
        }
}
