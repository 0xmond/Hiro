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
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Service.AuthenticationServices
{
    internal sealed class EmployeeAuthService : IEmployeeAuthService
    {
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly IRepositoryManager _repositoryManager;

        public EmployeeAuthService(ILoggerManager logger, IMapper mapper, IConfiguration configuration, UserManager<User> userManager, IRepositoryManager repository)
        {
            _logger = logger;
            _mapper = mapper;
            _configuration = configuration;
            _userManager = userManager;
            _repositoryManager = repository;
        }


        public async Task<IdentityResult> CreateEmployeeAsync(EmployeeForCreationDto employeeForCreation)
        {
            var user = new User
            {
                UserName = employeeForCreation.UserName,
                Email = employeeForCreation.Email,
                PhoneNumber = employeeForCreation.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, employeeForCreation.Password);

            if (result.Succeeded)
            {
                var employeeProfile = new EmployeeProfile
                {
                    UserId = user.Id,
                    CreatedAt = DateTime.Now,
                    DateOfBirth = employeeForCreation.DateOfBirth,
                    PhoneNumber = employeeForCreation.PhoneNumber,
                    FirstName = employeeForCreation.FirstName,
                    LastName = employeeForCreation.LastName,
                    UpdatedAt = DateTime.Now,
                };
                _repositoryManager.Employee.CreateEmployee(employeeProfile);

                await _repositoryManager.SaveAsync();
            }

            return result;
        }
    }
}
