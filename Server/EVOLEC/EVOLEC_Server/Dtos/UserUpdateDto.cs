﻿namespace EVOLEC_Server.Dtos
{
    public class UserUpdateDto
    {
        public string NameIdentifier { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PID { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Fullname { get; set; }
        public DateOnly Dob { get; set; }
        public int Gender { get; set; }
        public string? Address { get; set; }
        public string Role { get; set; }
    }
}
