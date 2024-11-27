using Contracts.Repository.Contracts;
using Entities.Models.Profiles;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories.ProfilesRepositories
{
    public class AdministratorRepository : RepositoryBase<AdministratorProfile>, IAdministratorRepository
    {
        public AdministratorRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<AdministratorProfile>> GetAllAdminsAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .ToListAsync();


        public async Task<AdministratorProfile> GetAdminAsync(Guid adminId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(adminId), trackChanges).SingleOrDefaultAsync();

        public async void CreateAdmin(AdministratorProfile administrator) => Create(administrator);

        public void DeleteAdmin(AdministratorProfile administrator) => Delete(administrator);


    }
}
