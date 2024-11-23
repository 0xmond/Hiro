using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.Repository.Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories
{
    public class EmployeeRepository : RepositoryBase<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .ToListAsync();


        public async Task<Employee> GetEmployeeAsync(Guid employeeId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(employeeId), trackChanges).SingleOrDefaultAsync();


        public void CreateEmployee(Employee employee) => Create(employee);

        public void DeleteEmployee(Employee employee) => Delete(employee);
    }
}
