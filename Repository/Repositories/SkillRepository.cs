using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class SkillRepository : RepositoryBase<Skill>, ISkillRepository
    {
       public SkillRepository(RepositoryContext repositoryContext) : base(repositoryContext)
       {
       }
    }
}
