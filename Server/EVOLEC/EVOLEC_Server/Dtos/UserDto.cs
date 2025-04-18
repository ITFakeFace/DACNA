namespace EVOLEC_Server.Dtos
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string PID { get; set; }
        public string Fullname { get; set; }
        public DateOnly Dob { get; set; }
        public int Gender { get; set; }
        public string? Address { get; set; }
        public string Role { get; set; }
        public DateTime? Lockout { get; set; }
    }
}
