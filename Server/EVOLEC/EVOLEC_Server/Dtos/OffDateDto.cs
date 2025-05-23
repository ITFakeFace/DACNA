using EVOLEC_Server.Models;
using System.ComponentModel.DataAnnotations;

namespace EVOLEC_Server.Dtos
{
    public class OffDateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public int Status { get; set; }
    }
}
