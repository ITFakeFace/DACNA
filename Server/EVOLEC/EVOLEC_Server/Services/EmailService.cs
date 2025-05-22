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
                <html>
                  <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
                      <h2 style='color: #2E86C1; text-align: center;'>EVOLEC - Password Reset</h2>
                      <p style='font-size: 16px; color: #333;'>Hello,</p>
                      <p style='font-size: 16px; color: #333;'>We received a request to reset your password. Please use the following verification code:</p>
                      <p style='text-align: center; font-size: 24px; font-weight: bold; color: #2E86C1; margin: 20px 0;'>{confirmCode}</p>
                      <p style='font-size: 14px; color: #555;'>If you didn't request a password reset, please ignore this email.</p>
                      <hr style='margin: 30px 0;' />
                      <p style='font-size: 12px; color: #999;'>Thank you for choosing EVOLEC.</p>
                    </div>
                  </body>
                </html>";
            return SendEmail(recipientEmail, subject, body);
        }
    }
}
