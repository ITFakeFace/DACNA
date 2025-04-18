using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public abstract class EntityWithTimeStamp
    {
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime? UpdatedAt { get; set; }
    }
}
