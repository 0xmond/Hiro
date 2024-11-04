using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IJobSeekerRepository
    {
        Task<IEnumerable<JobSeeker>> GetAllJobSeekersAsync(bool trackChanges);
        Task<JobSeeker> GetJobSeekerAsync(Guid jobSeekerId, bool trackChanges);
        void CreateJobSeeker(JobSeeker jobSeeker);
        void DeleteJobSeeker(JobSeeker jobSeeker);
    }
}
