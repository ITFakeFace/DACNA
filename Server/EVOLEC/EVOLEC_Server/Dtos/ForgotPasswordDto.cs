namespace EVOLEC_Server.Dtos
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string CorrectCode { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
