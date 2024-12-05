using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, (string subject, string body) details);
        Task<bool> IsValidEmail(string email);
    }
}
