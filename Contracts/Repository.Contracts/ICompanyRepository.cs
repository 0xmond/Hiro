using Entities.Models.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface ICompanyRepository
    {
        Task<IEnumerable<CompanyProfile>> GetAllCompaniesAsync(bool trackChanges);
        Task<CompanyProfile> GetCompanyAsync(Guid companyId, bool trackChanges);
        void CreateCompany(CompanyProfile company);
        void DeleteCompany(CompanyProfile company);
    }
}






