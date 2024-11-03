using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class AdministratorRepository : RepositoryBase<Employee>, IAdministratorRepository
    {
        public AdministratorRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
