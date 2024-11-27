using AutoMapper;
using Contracts;
using Entities.Models;
using Entities.Models.Profiles;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Service.Contracts.AuthenticationServices.Contracts;
using Shared.DataTransferObjects.AuthenticationDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Xml.Linq;

namespace Service.AuthenticationServices
{
    internal sealed class CompanyAuthService : ICompanyAuthService
    {
        private readonly IRepositoryManager _repository;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private User? _user;

        public CompanyAuthService(IRepositoryManager repository, ILoggerManager logger, IMapper mapper, UserManager<User> userManager, IConfiguration configuration)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
            _configuration = configuration;
        }

        // Authentication
        public async Task<IdentityResult> CreateCompanyAsync(CompanyForCreationDto company)
        {
            var user = new User
            {
                UserName = company.UserName,
                Email = company.Email,
                PhoneNumber = company.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, company.Password);

            if (result.Succeeded)
            {
                var companyProfile = new CompanyProfile
                {
                    CompanyName = company.CompanyName,
                    Address = company.Address,
                    PhoneNumber = company.PhoneNumber,
                    UserId = user.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _repository.Company.CreateCompany(companyProfile);

                await _repository.SaveAsync();
            }

            return result;
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
                new Claim(ClaimTypes.Name, _user.UserName)
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
