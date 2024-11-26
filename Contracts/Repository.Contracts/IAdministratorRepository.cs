using Entities.Models.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IAdministratorRepository
    {
        Task<IEnumerable<AdministratorProfile>> GetAllAdminsAsync(bool trackChanges);
        Task<AdministratorProfile> GetAdminAsync(Guid adminId, bool trackChanges);
        void CreateAdmin(AdministratorProfile administrator);
        void DeleteAdmin(AdministratorProfile administrator);
    }
}




