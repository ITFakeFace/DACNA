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

        public bool SendEmailRescheduleClass(string recipientEmail, DateTime oldDate, DateTime newDate)
        {
            string subject = "Class Rescheduled Notification";
            string body = $@"
                <html>
                  <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
                      <h2 style='color: #E67E22; text-align: center;'>EVOLEC - Class Reschedule</h2>
                      <p style='font-size: 16px; color: #333;'>Hello,</p>
                      <p style='font-size: 16px; color: #333;'>We would like to inform you that your scheduled class has been rescheduled.</p>
                      <p style='font-size: 16px; color: #333;'><strong>Original Date:</strong> {oldDate:dddd, dd MMMM yyyy}</p>
                      <p style='font-size: 16px; color: #333;'><strong>New Date:</strong> {newDate:dddd, dd MMMM yyyy}</p>
                      <p style='font-size: 14px; color: #555;'>Please make a note of the change. If you have any questions, feel free to contact us.</p>
                      <hr style='margin: 30px 0;' />
                      <p style='font-size: 12px; color: #999;'>Thank you for being a valued student at EVOLEC.</p>
                    </div>
                  </body>
                </html>";

            return SendEmail(recipientEmail, subject, body);
        }

        public bool SendTuitionNotificationEmail(string recipientEmail, string studentName, string semester, decimal amount, DateTime dueDate)
        {
            string subject = "EVOLEC - Tuition Fee Notice";
            string body = $@"
                <html>
                  <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
                      <h2 style='color: #D35400; text-align: center;'>Tuition Fee Notice</h2>
                      <p>Hello {studentName},</p>
                      <p>This is a reminder that your tuition fee for the <strong>{semester}</strong> semester is:</p>
                      <p style='font-size: 20px; font-weight: bold; color: #D35400;'>VNĐ {amount:N0}</p>
                      <p>Please make the payment by <strong>{dueDate:dd/MM/yyyy}</strong> to avoid any interruptions in your learning process.</p>
                      <p>If you have already made the payment, please ignore this message.</p>
                      <hr style='margin: 30px 0;' />
                      <p style='font-size: 12px; color: #999;'>Thank you for choosing EVOLEC.</p>
                    </div>
                  </body>
                </html>";
            return SendEmail(recipientEmail, subject, body);
        }
        public bool SendCourseCompletionEmail(string recipientEmail, string studentName, string courseName, DateTime completionDate)
        {
            string subject = "Congratulations on Completing Your Course at EVOLEC!";
            string body = $@"
                <html>
                  <body style='font-family: Arial, sans-serif; background-color: #e8f8f5; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; text-align: center;'>
                      <h2 style='color: #28B463;'>🎉 Congratulations, {studentName}!</h2>
                      <p>You have successfully completed the course:</p>
                      <h3 style='color: #2E86C1;'>{courseName}</h3>
                      <p>on <strong>{completionDate:dd/MM/yyyy}</strong>.</p>
                      <p>We are proud of your progress and wish you continued success on your English learning journey.</p>
                      <p>If this course provides a certificate, you may download it from your student portal.</p>
                      <hr style='margin: 30px 0;' />
                      <p style='font-size: 12px; color: #999;'>Thank you for learning with EVOLEC.</p>
                    </div>
                  </body>
                </html>";
            return SendEmail(recipientEmail, subject, body);
        }
        public bool SendCourseEnrollmentEmail(string recipientEmail, string studentName, string courseName, DateTime startDate, string schedule)
        {
            string subject = "EVOLEC - Course Enrollment Confirmation";
            string body = $@"
                <html>
                  <body style='font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px;'>
                      <h2 style='color: #3498DB;'>Welcome to {courseName}!</h2>
                      <p>Dear {studentName},</p>
                      <p>Thank you for enrolling in the course <strong>{courseName}</strong> at EVOLEC.</p>
                      <p><strong>Start Date:</strong> {startDate:dd/MM/yyyy}</p>
                      <p><strong>Schedule:</strong> {schedule}</p>
                      <p>We are excited to have you on board and look forward to helping you achieve your English learning goals.</p>
                      <p>If you have any questions, feel free to contact us.</p>
                      <hr style='margin: 30px 0;' />
                      <p style='font-size: 12px; color: #999;'>EVOLEC - Your English Learning Companion</p>
                    </div>
                  </body>
                </html>";
            return SendEmail(recipientEmail, subject, body);
        }


    }
}
