using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Models
{
    public class ApplicationUser : IdentityUserWithTimeStamp
    {
        [Required]
        public string Fullname { get; set; }
        public string PID { get; set; }
        [Required]
        public DateOnly Dob { get; set; }
        [Required]
        public int Gender { get; set; }
        public string? Address { get; set; }

    }
}
