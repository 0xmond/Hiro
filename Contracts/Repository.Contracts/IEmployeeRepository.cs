using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync(bool trackChanges);
        Task<Employee> GetEmployeeAsync(Guid adminId, bool trackChanges);
        void CreateEmployee(Employee employee);
        void DeleteEmployee(Employee employee);
    }
}
