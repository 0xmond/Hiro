using Microsoft.Extensions.Configuration;
using Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;


namespace Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to)
        {

            var resetPassword = EmailResetPassword();

            var smtpClient = new SmtpClient(_configuration["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_configuration["EmailSettings:Port"]),
                Credentials = new NetworkCredential(
                    _configuration["EmailSettings:Username"],
                    _configuration["EmailSettings:Password"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:From"]),
                Subject = resetPassword.subject,
                Body = resetPassword.body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(to);



            await smtpClient.SendMailAsync(mailMessage);
        }

        // Helper method to validate email format
        public bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }


        private (string subject, string body) EmailResetPassword()
        {
            // Generate the reset link (this logic should be dynamic and secure)
            string resetToken = Guid.NewGuid().ToString(); // Example token generation
            string resetLink = $"http://localhost:5270.com/reset-password?token={resetToken}";

            string subject = "Password Reset Request";
            string body = $"<p>Click the link to reset your password: <a href='{resetLink}'>Reset Password</a></p>";

            return (subject: subject, body: body);
        }
    }
}