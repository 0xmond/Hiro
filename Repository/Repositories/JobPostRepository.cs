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
    public class JobPostRepository : RepositoryBase<JobPost>, IJobPostRepository
    {
        public JobPostRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<JobPost>> GetAllJobPostsAsync(bool trackChanges)
               => await FindAll(trackChanges)
                .ToListAsync();

        public async Task<JobPost> GetJobPostAsync(string companyId, bool trackChanges) =>
            await FindByCondition(c => c.Id.ToString().Equals(companyId), trackChanges).Include(p => p.Company).SingleOrDefaultAsync();


        public void CreateJobPost(JobPost jobPost) => Create(jobPost);

        public void DeleteJobPost(JobPost jobPost) => Delete(jobPost);
    }
}
