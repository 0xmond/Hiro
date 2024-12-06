using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repository.Contracts
{
    public interface IJobPostRepository
    {
        Task<IEnumerable<JobPost>> GetAllJobPostsAsync(bool trackChanges);
        Task<JobPost> GetJobPostAsync(string jobPostId, bool trackChanges);
        void CreateJobPost(JobPost jobPost);
        void DeleteJobPost(JobPost jobPost);
    }
}
