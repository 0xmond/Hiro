using Contracts.Repository.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IRepositoryManager
    {
        ICompanyRepository Company { get; }
        IAdministratorRepository Administrator { get; }
        IEmployeeRepository Employee { get; }
        IJobSeekerRepository JobSeeker { get; }
        IUserRepository User { get; }
        IJobPostRepository JobPost { get; }
        Task SaveAsync();
    }
}
