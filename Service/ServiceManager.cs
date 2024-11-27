using AutoMapper;
using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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

        public ServiceManager(IRepositoryManager repositoryManager, ILoggerManager loggerManager, IMapper mapper, IConfiguration configuration, UserManager<User> userManager) 
        {
            _companyService = new Lazy<CompanyAuthService>(() => new CompanyAuthService(repositoryManager, loggerManager, mapper, userManager, configuration));

            _administratorService = new Lazy<AdministratorAuthService>(() => new AdministratorAuthService(loggerManager, mapper, configuration, userManager, repositoryManager));

            _employeeService = new Lazy<EmployeeAuthService>(() => new EmployeeAuthService(loggerManager, mapper, configuration, userManager, repositoryManager));
        }

        public ICompanyAuthService CompanyService => _companyService.Value;
        public IAdministratorAuthService AdministratorService => _administratorService.Value;
        public IEmployeeAuthService EmployeeAuthService => _employeeService.Value;
    }
}
