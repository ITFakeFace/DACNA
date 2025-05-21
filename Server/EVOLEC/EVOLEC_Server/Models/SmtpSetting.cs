namespace EVOLEC_Server.Models
{
    public class SmtpSetting
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string SenderEmail { get; set; }
        public string SenderPassword { get; set; }
    }
}
