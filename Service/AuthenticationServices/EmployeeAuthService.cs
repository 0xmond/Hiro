using AutoMapper;
using Contracts;
using Entities.Models;
using Entities.Models.Profiles;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository;
using Service.Contracts.AuthenticationServices.Contracts;
using Shared.DataTransferObjects.AuthenticationDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
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
        private readonly RepositoryContext _repositoryContext;

        public EmployeeAuthService(ILoggerManager logger, IMapper mapper, IConfiguration configuration, UserManager<User> userManager, IRepositoryManager repository, RepositoryContext repositoryContext)
        {
            _logger = logger;
            _mapper = mapper;
            _configuration = configuration;
            _userManager = userManager;
            _repositoryManager = repository;
            _repositoryContext = repositoryContext;
        }


        public async Task<IdentityResult> CreateEmployeeAsync(EmployeeForCreationDto employeeForCreation)
        {
            using var transaction = await _repositoryContext.Database.BeginTransactionAsync();
            IdentityResult result = IdentityResult.Failed();

            try
            {
                var user = new User
                {
                    UserName = employeeForCreation.UserName,
                    Email = employeeForCreation.Email,
                    PhoneNumber = employeeForCreation.PhoneNumber,
                };

                await _userManager.CreateAsync(user, employeeForCreation.Password);

                var employeeProfile = new EmployeeProfile
                {
                    FirstName = employeeForCreation.FirstName,
                    LastName = employeeForCreation.LastName,
                    PhoneNumber = employeeForCreation.PhoneNumber,
                    UserId = user.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    DateOfBirth = employeeForCreation.DateOfBirth
                };
                _repositoryManager.Employee.CreateEmployee(employeeProfile);

                await _repositoryManager.SaveAsync();

                await transaction.CommitAsync();

            } catch (Exception e)
            {
                // Rollback the transaction if any step fails
                await transaction.RollbackAsync();
                return result;
            }

            return IdentityResult.Success;
        }
    }
}
