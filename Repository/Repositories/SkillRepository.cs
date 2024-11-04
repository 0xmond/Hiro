using Contracts.Repository.Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<Skill>> GetAllSkillsAsync(bool trackChanges)
           => await FindAll(trackChanges)
            .ToListAsync();

        public async Task<Skill> GetSkillAsync(Guid skillId, bool trackChanges) =>
            await FindByCondition(c => c.Id.Equals(skillId), trackChanges).SingleOrDefaultAsync();


        public void CreateSkill(Skill jobPost) => Create(jobPost);

        public void DeleteSkill(Skill jobPost) => Delete(jobPost);
    }
}
