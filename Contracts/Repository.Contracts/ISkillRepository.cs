using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface ISkillRepository
    {
        Task<IEnumerable<Skill>> GetAllSkillsAsync(bool trackChanges);
        Task<Skill> GetSkillAsync(Guid skillId, bool trackChanges);
        void CreateSkill(Skill skill);
        void DeleteSkill(Skill skill);
    }
}
