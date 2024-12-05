using Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Contracts;

namespace Service
{
    public sealed class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly IRepositoryManager _repositoryManager;

        public EmailService(IConfiguration configuration, IRepositoryManager repositoryManager)
        {
            _configuration = configuration;
            _repositoryManager = repositoryManager;
        }
        public async Task<bool> IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                var userIfExists = await _repositoryManager.User.GetUserAsync(email, trackChanges:false);
                
                if (userIfExists is null)
                {
                    return false;
                }

                return addr.Address == userIfExists.Email;
            }
            catch
            {
                return false;
            }
        }

        public async Task SendEmailAsync(string to, (string subject, string body) details)
        {

            var smtpClient = new SmtpClient(_configuration["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_configuration["EmailSettings:Port"]),
                Credentials = new NetworkCredential(
                    _configuration["EmailSettings:Username"],
                    Environment.GetEnvironmentVariable("SMTPpass")),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:From"]),
                Subject = details.subject,
                Body = details.body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(to);



            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
