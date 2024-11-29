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
using System.Security.Cryptography;
using Entities.ErrorModel;

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

        
    }
}
