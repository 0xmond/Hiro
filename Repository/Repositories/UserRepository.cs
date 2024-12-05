using Contracts.Repository.Contracts;
using Entities.Models;
using Entities.Models.Profiles;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
        public async Task<User> GetUserAsync(string email, bool trackChanges)
            => await FindByCondition(u => u.Email == email, trackChanges).SingleOrDefaultAsync();

    }
}
