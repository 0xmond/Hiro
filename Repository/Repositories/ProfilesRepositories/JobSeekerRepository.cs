using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.Repository.Contracts;
using Entities.Models.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories.ProfilesRepositories
{
    public class JobSeekerRepository : RepositoryBase<JobSeekerProfile>, IJobSeekerRepository
    {
        public JobSeekerRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<JobSeekerProfile>> GetAllJobSeekersAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .ToListAsync();

        public async Task<JobSeekerProfile> GetJobSeekerAsync(Guid jobSeekerId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(jobSeekerId), trackChanges).SingleOrDefaultAsync();


        public void CreateJobSeeker(JobSeekerProfile jobSeeker) => Create(jobSeeker);

        public void DeleteJobSeeker(JobSeekerProfile jobSeeker) => Delete(jobSeeker);
    }
}
