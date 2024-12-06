using Service.Contracts.AuthenticationServices.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IServiceManager
    {
        ICompanyAuthService CompanyService { get; }
        IAdministratorAuthService AdministratorService { get; }
        IEmployeeAuthService EmployeeAuthService { get; }
        IJobSeekerAuthService JobSeekerAuthService { get; }
        IAuthenticationService AuthenticationService { get; }
        IResetPasswordService ResetPasswordService { get; }
        IUserService UserService { get; }
        IJobPostService JobPostService { get; }
    }
}
