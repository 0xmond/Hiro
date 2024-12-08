using Entities.Models;
using Shared.DataTransferObjects.JobPostDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IJobPostService
    {
        Task<IEnumerable<JobPostDTO>> GetAllJobPostsAsync(bool trackChanges);
        Task<JobPost> GetJobPostAsync(string jobPostId, bool trackChanges);
        Task RegisterJobPostAsync(JobPostRegisterDTO jobPostRegisterDto);
        Task DeleteJobPost(string jobPostId);
        bool isValid(JobPost jobPost);
        bool isOwn(string currentUserId, string postId);
    }
}
