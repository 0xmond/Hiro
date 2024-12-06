using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.AuthenticationServices
{
    internal sealed class ResetPasswordService : IResetPasswordService
    {
        private readonly IEmailService _emailService;
        private readonly UserManager<User> _userManager;

        public ResetPasswordService(IEmailService emailService, UserManager<User> userManager)
        {
            _emailService = emailService;
            _userManager = userManager;
        }
        
        


        public async Task<bool> SendResetEmailAsync(string email, string userId)
        {
            if (!await _emailService.IsValidEmail(email))
                return false;

            var details = await ResetPasswordEmail(userId, email);

            if (details.subject is null)
                return false;

            await _emailService.SendEmailAsync(email, details);
            return true;
        }
        
        
        
        private async Task<(string? subject, string? body)> ResetPasswordEmail(string userId, string email)
        {
            string resetToken = await GeneratePasswordResetTokenAsync(userId);

            if (string.IsNullOrEmpty(resetToken))
                return (null,null);

            string resetLink = $"https://hiro.runasp.net/reset-password?token={resetToken}&email={email}";

            string subject = "Password Reset Request";
            string body = $"<p>Click the link to reset your password: <a href='{resetLink}'>Reset Password</a></p>";

            return (subject, body);
        }

        

        private async Task<string> GeneratePasswordResetTokenAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return "";

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            return token;
        }




    }
}
