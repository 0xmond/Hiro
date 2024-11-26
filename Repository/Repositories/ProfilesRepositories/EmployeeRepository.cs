using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.Repository.Contracts;
using Entities.Models.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories.ProfilesRepositories
{
    public class EmployeeRepository : RepositoryBase<EmployeeProfile>, IEmployeeRepository
    {
        public EmployeeRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<EmployeeProfile>> GetAllEmployeesAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .ToListAsync();


        public async Task<EmployeeProfile> GetEmployeeAsync(Guid employeeId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(employeeId), trackChanges).SingleOrDefaultAsync();


        public void CreateEmployee(EmployeeProfile employee) => Create(employee);

        public void DeleteEmployee(EmployeeProfile employee) => Delete(employee);
    }
}
