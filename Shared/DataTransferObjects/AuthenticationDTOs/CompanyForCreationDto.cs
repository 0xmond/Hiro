using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.AuthenticationDTOs
{
    public record CompanyForCreationDto
    {
        [Required]
        public string CompanyName { get; init; }
        public string Address { get; init; }
        [Required(ErrorMessage = "Username is required")]
        public string? UserName { get; init; }
        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; init; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; init; }
        [Required(ErrorMessage = "Phone number is required")]
        public string? PhoneNumber { get; init; }
    }
}
