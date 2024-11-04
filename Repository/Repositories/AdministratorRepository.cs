using Contracts.Repository.Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class AdministratorRepository : RepositoryBase<Administrator>, IAdministratorRepository
    {
        public AdministratorRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<Administrator>> GetAllAdminsAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .ToListAsync();


        public async Task<Administrator> GetAdminAsync(Guid adminId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(adminId), trackChanges).SingleOrDefaultAsync();

        public void CreateAdmin(Administrator administrator) => Create(administrator);

        public void DeleteAdmin(Administrator administrator) => Delete(administrator);

        
    }
}
