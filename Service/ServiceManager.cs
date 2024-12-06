using AutoMapper;
using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Repository;
using Service.AuthenticationServices;
using Service.Contracts;
using Service.Contracts.AuthenticationServices.Contracts;
using Service.ProfilesServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public sealed class ServiceManager : IServiceManager
    {
        private readonly Lazy<CompanyAuthService> _companyService;
        private readonly Lazy<AdministratorAuthService> _administratorService;
        private readonly Lazy<EmployeeAuthService> _employeeService;
        private readonly Lazy<JobSeekerAuthService> _jobSeekerAuthService;
        private readonly Lazy<AuthenticationService> _authenticationService;
        private readonly Lazy<ResetPasswordService> _resetPasswordService;
        private readonly Lazy<UserService> _userService;
        private readonly Lazy<JobPostService> _jobPostService;

        public ServiceManager(IRepositoryManager repositoryManager, ILoggerManager loggerManager, IMapper mapper, IConfiguration configuration, UserManager<User> userManager, RepositoryContext repositoryContext, IEmailService emailService) 
        {
            _companyService = new Lazy<CompanyAuthService>(() => new CompanyAuthService(repositoryManager, loggerManager, mapper, userManager, configuration));

            _administratorService = new Lazy<AdministratorAuthService>(() => new AdministratorAuthService(loggerManager, mapper, configuration, userManager, repositoryManager));

            _employeeService = new Lazy<EmployeeAuthService>(() => new EmployeeAuthService(loggerManager, mapper, configuration, userManager, repositoryManager, repositoryContext));

            _jobSeekerAuthService = new Lazy<JobSeekerAuthService>(() => new JobSeekerAuthService(loggerManager, mapper, configuration, userManager, repositoryManager, repositoryContext));

            _authenticationService = new Lazy<AuthenticationService>(() => new AuthenticationService(repositoryManager, loggerManager, userManager, configuration));

            _resetPasswordService = new Lazy<ResetPasswordService>(() => new ResetPasswordService(emailService, userManager));

            _userService = new Lazy<UserService>(() => new UserService(userManager));

            _jobPostService = new Lazy<JobPostService>(() => new JobPostService(repositoryManager, mapper));
        }

        public ICompanyAuthService CompanyService => _companyService.Value;
        public IAdministratorAuthService AdministratorService => _administratorService.Value;
        public IEmployeeAuthService EmployeeAuthService => _employeeService.Value;
        public IJobSeekerAuthService JobSeekerAuthService => _jobSeekerAuthService.Value;
        public IAuthenticationService AuthenticationService => _authenticationService.Value;
        public IResetPasswordService ResetPasswordService => _resetPasswordService.Value;
        public IUserService UserService => _userService.Value;
        public IJobPostService JobPostService => _jobPostService.Value;

    }
}
