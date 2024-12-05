using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.AuthenticationDTOs
{
    public record class PasswordResetDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Token is required")]
        public string Token { get; set; }

        [Required(ErrorMessage = "Please enter your new password")]
        [MinLength(8, ErrorMessage = "Password must be 8 characters at least")]
        public string NewPassword { get; set; }
    }
}
