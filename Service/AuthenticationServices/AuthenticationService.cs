using AutoMapper;
using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Service.Contracts.AuthenticationServices.Contracts;
using Shared.DataTransferObjects.AuthenticationDTOs;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service.AuthenticationServices
{
    internal sealed class AuthenticationService : IAuthenticationService
    {
        private readonly IRepositoryManager _repository;
        private readonly ILoggerManager _logger;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private User? _user;

        public AuthenticationService(IRepositoryManager repository, ILoggerManager logger, UserManager<User> userManager, IConfiguration configuration)
        {
            _repository = repository;
            _logger = logger;
            _userManager = userManager;
            _configuration = configuration;
        }


        public async Task<bool> ValidateUser(UserForLoginDto userForAuth)
        {
            _user = await _userManager.FindByNameAsync(userForAuth.UserName);
            var result = (_user != null && await _userManager.CheckPasswordAsync(_user, userForAuth.Password));
            if (!result)
                _logger.LogWarn($"{nameof(ValidateUser)}: Authentication failed. Wrong username or password.");
            return result;
        }

        public async Task<string> CreateToken()
        {
            // credetionals => secret key
            var signingCredintials = GetSigningCredentials();

            // adding the roles to logging user
            var getClaims = await GetClaims();

            // configuring token
            var tokenOptions = GenerateTokenOptions(signingCredintials, getClaims);

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET"));
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        private async Task<List<Claim>> GetClaims()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, _user.UserName),
                new Claim(ClaimTypes.NameIdentifier, _user.Id)
            };

            var roles = await _userManager.GetRolesAsync(_user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var tokenOptions = new JwtSecurityToken
            (
                issuer: jwtSettings["validIssuer"],
                audience: jwtSettings["validAudience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["expires"])),
                signingCredentials: signingCredentials
            );

            return tokenOptions;
        }
    }
}
