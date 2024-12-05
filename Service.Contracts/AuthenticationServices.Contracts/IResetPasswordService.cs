using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IResetPasswordService
    {
        Task<bool> SendResetEmailAsync(string email, string userId);
        //Task<string> GeneratePasswordResetTokenAsync(string userId);
    }
}
