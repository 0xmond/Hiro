using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Contracts.Repository.Contracts;

namespace Repository.Repositories
{
    public class CompanyRepository : RepositoryBase<Company>, ICompanyRepository
    {
        public CompanyRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<Company>> GetAllCompaniesAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .OrderBy(c => c.CompanyName)
                .ToListAsync();


        public async Task<Company> GetCompanyAsync(Guid companyId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(companyId), trackChanges).SingleOrDefaultAsync();


        public void CreateCompany(Company company) => Create(company);

        public void DeleteCompany(Company company) => Delete(company);

    }
}

