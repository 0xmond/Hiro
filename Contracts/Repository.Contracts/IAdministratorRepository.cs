using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IAdministratorRepository
    {
        Task<IEnumerable<Administrator>> GetAllAdminsAsync(bool trackChanges);
        Task<Administrator> GetAdminAsync(Guid adminId, bool trackChanges);
        void CreateAdmin(Administrator administrator);
        void DeleteAdmin(Administrator administrator);
    }
}




