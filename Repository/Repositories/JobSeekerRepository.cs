using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.Repository.Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories
{
    public class JobSeekerRepository : RepositoryBase<JobSeeker>, IJobSeekerRepository
    {
        public JobSeekerRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<JobSeeker>> GetAllJobSeekersAsync(bool trackChanges)
           => await FindAll(trackChanges)
                .OrderBy(c => c.User.FirstName)
                .ToListAsync();

        public async Task<JobSeeker> GetJobSeekerAsync(Guid jobSeekerId, bool trackChanges) =>
            await FindByCondition(c => c.UserId.Equals(jobSeekerId), trackChanges).SingleOrDefaultAsync();


        public void CreateJobSeeker(JobSeeker jobSeeker) => Create(jobSeeker);

        public void DeleteJobSeeker(JobSeeker jobSeeker) => Delete(jobSeeker);
    }
}
