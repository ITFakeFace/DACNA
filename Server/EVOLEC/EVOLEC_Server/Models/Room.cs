using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVOLEC_Server.Models
{
    public class Room
    {
        [Key]
        [Required]
        public int ID { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public int Status { get; set; } = 1;
    }
}
