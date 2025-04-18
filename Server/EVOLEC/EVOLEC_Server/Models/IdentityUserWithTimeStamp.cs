using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class IdentityUserWithTimeStamp : IdentityUser
    {
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime? UpdatedAt { get; set; }
    }
}
