using Entities.Models.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IJobSeekerRepository
    {
        Task<IEnumerable<JobSeekerProfile>> GetAllJobSeekersAsync(bool trackChanges);
        Task<JobSeekerProfile> GetJobSeekerAsync(Guid jobSeekerId, bool trackChanges);
        void CreateJobSeeker(JobSeekerProfile jobSeeker);
        void DeleteJobSeeker(JobSeekerProfile jobSeeker);
    }
}
