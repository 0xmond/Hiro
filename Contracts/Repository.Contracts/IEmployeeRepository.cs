using Entities.Models.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<EmployeeProfile>> GetAllEmployeesAsync(bool trackChanges);
        Task<EmployeeProfile> GetEmployeeAsync(Guid adminId, bool trackChanges);
        void CreateEmployee(EmployeeProfile employee);
        void DeleteEmployee(EmployeeProfile employee);
    }
}
