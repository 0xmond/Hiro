using Entities.Models;
using Entities.Models.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IUserRepository
    {
        Task<User> GetUserAsync(string email, bool trackChanges);
    }
}
