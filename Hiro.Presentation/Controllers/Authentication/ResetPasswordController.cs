using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Service.Contracts;
using Shared.DataTransferObjects.AuthenticationDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hiro.Presentation.Controllers.Authentication
{
    [Route("/api")]
    [ApiController]
    public class ResetPasswordController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;
        private readonly ILoggerManager _logger;
        private readonly UserManager<User> _userManager;

        public ResetPasswordController(IServiceManager serviceManager, ILoggerManager loggerManager, UserManager<User> userManager)
        {
            _serviceManager = serviceManager;
            _logger = loggerManager;
            _userManager = userManager;
        }

        
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                await _serviceManager.ResetPasswordService.SendResetEmailAsync(request.Email, user.Id);
            }
            catch (Exception e)
            {
            }


            return Ok(new { message = "If the email address exists, you will get a reset link in your inbox" });
        }




        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto passwordResetDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(passwordResetDto.Email);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.ResetPasswordAsync(user, passwordResetDto.Token, passwordResetDto.NewPassword);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }

            return Ok(new { message = "Password has been reset successfully" });
        }
    }
}
