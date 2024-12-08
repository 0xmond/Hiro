using AutoMapper;
using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Service.Contracts;
using Shared.DataTransferObjects.JobPostDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    internal sealed class JobPostService : SecurityService<JobPost>, IJobPostService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public JobPostService(IRepositoryManager repositoryManager, IMapper autoMapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = autoMapper;
        }

        public async Task DeleteJobPost(string jobPostId)
        {
            var post = await _repositoryManager.JobPost.GetJobPostAsync(jobPostId, trackChanges: false);

            _repositoryManager.JobPost.DeleteJobPost(post);

            await _repositoryManager.SaveAsync();

        }

        public async Task<IEnumerable<JobPostDTO>> GetAllJobPostsAsync(bool trackChanges)
        {
            var posts = await _repositoryManager.JobPost.GetAllJobPostsAsync(trackChanges);

            var postsDto = _mapper.Map<IEnumerable<JobPostDTO>>(posts);

            return postsDto;
        }

        public async Task<JobPost> GetJobPostAsync(string jobPostId, bool trackChanges)
        {
            return await _repositoryManager.JobPost.GetJobPostAsync(jobPostId, trackChanges);
        }

        public bool isValidPost(JobPost jobPost) => isValid(jobPost);

        public bool isOwnPost(string currentUserId, string postId) => isOwn(currentUserId, postId);

        public async Task RegisterJobPostAsync(JobPostRegisterDTO jobPostRegisterDto)
        {
            if (jobPostRegisterDto == null)
                throw new ArgumentNullException(nameof(jobPostRegisterDto));

            var jobPostEntity = _mapper.Map<JobPost>(jobPostRegisterDto);

            // Set default fields
            jobPostEntity.Id = Guid.NewGuid();
            jobPostEntity.CreatedAt = DateTime.UtcNow;
            jobPostEntity.UpdatedAt = DateTime.UtcNow;

            // Save to the repository
            _repositoryManager.JobPost.CreateJobPost(jobPostEntity);
            await _repositoryManager.SaveAsync();
        }
    }
}

