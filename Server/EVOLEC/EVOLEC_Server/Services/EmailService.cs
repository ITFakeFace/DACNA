using EVOLEC_Server.Models;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace EVOLEC_Server.Services
{
    public class EmailService
    {
        private readonly SmtpSetting _smtpSettings;

        public EmailService(IOptions<SmtpSetting> smtpOptions)
        {
            _smtpSettings = smtpOptions.Value;
        }

        public bool SendEmail(string recipientEmail, string subject, string body)
        {
            try
            {
                using var smtpClient = new SmtpClient(_smtpSettings.Server)
                {
                    Port = _smtpSettings.Port,
                    Credentials = new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.SenderPassword),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpSettings.SenderEmail, "EVOLEC - Evolution English Center"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(recipientEmail);

                smtpClient.Send(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                return false;
            }
        }

        public bool SendEmailForgotPassword(string recipientEmail, string confirmCode)
        {
            string subject = "Forgot Password Confirmation Code";
            string body = $@"
                <h2 style='color: #2E86C1;'>Welcome to EVOLEC!</h2>
                <p>Your verification code is: <strong style='font-size: 20px;'>{confirmCode}</strong></p>
                <p>Thank you for using our service.</p>
            "; ;
            return SendEmail(recipientEmail, subject, body);
        }
    }
}
