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
    public class JobApplicationRepository : RepositoryBase<JobApplication>, IJobApplicationRepository
    {
        public JobApplicationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<JobApplication>> GetAllJobApplicationsAsync(bool trackChanges)
           => await FindAll(trackChanges)
            .ToListAsync();

        public async Task<JobApplication> GetJobApplicationAsync(Guid companyId, bool trackChanges) =>
            await FindByCondition(c => c.Id.Equals(companyId), trackChanges).SingleOrDefaultAsync();


        public void CreateJobApplication(JobApplication jobApplication) => Create(jobApplication);

        public void DeleteJobApplication(JobApplication jobApplication) => Delete(jobApplication);
    }
}
