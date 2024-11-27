using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Contracts.Repository.Contracts;
using Entities.Models.Profiles;

namespace Repository.Repositories.ProfilesRepositories
{
    public class CompanyRepository : RepositoryBase<CompanyProfile>, ICompanyRepository
    {
        public CompanyRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<CompanyProfile>> GetAllCompaniesAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .OrderBy(c => c.CompanyName)
                .ToListAsync();


        public async Task<CompanyProfile> GetCompanyAsync(Guid companyId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(companyId), trackChanges).SingleOrDefaultAsync();


        public async void CreateCompany(CompanyProfile company) => Create(company);

        public void DeleteCompany(CompanyProfile company) => Delete(company);

    }
}

