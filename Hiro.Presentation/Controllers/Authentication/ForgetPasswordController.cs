using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public AuthController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { Message = "Email address is required." });
            }

            try
            {
                // Validate email format (optional, but recommended)
                if (!_emailService.IsValidEmail(email))
                {
                    return BadRequest(new { Message = "Invalid email format." });
                }

                
                await _emailService.SendEmailAsync(email);

                return Ok(new { Message = "Password reset email sent successfully." });
            }
            catch (FormatException ex)
            {
                // Handle format-specific errors
                return BadRequest(new { Message = "Error: Invalid email format.", Details = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception (recommended)
                // _logger.LogError(ex, "Error sending password reset email");

                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        
    }
}

