using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IJobApplicationRepository
    {
        Task<IEnumerable<JobApplication>> GetAllJobApplicationsAsync(bool trackChanges);
        Task<JobApplication> GetJobApplicationAsync(Guid jobApplicationId, bool trackChanges);
        void CreateJobApplication(JobApplication jobApplication);
        void DeleteJobApplication(JobApplication jobApplication);
    }
}
