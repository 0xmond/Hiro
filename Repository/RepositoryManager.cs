using Contracts;
using Contracts.Repository.Contracts;
using Entities.Models;
using Repository.Repositories;
using Repository.Repositories.ProfilesRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public sealed class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _repositoryContext;
        private readonly Lazy<ICompanyRepository> _companyRepository;
        private readonly Lazy<IAdministratorRepository> _administratorRepository;
        private readonly Lazy<IEmployeeRepository> _employeeRepository;
        private readonly Lazy<IJobApplicationRepository> _jobApplicationRepository;
        private readonly Lazy<IJobPostRepository> _jobPostRepository;
        private readonly Lazy<IJobSeekerRepository> _jobSeekerRepository;
        private readonly Lazy<ISkillRepository> _skillRepository;
        private readonly Lazy<IUserRepository> _userRepository;

        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
            _companyRepository = new Lazy<ICompanyRepository>(() => new CompanyRepository(repositoryContext));
            _administratorRepository = new Lazy<IAdministratorRepository>(() => new AdministratorRepository(repositoryContext));
            _employeeRepository = new Lazy<IEmployeeRepository>(() => new EmployeeRepository(repositoryContext));
            _jobApplicationRepository = new Lazy<IJobApplicationRepository>(() => new JobApplicationRepository(repositoryContext));
            _jobPostRepository = new Lazy<IJobPostRepository>(() => new JobPostRepository(repositoryContext));
            _jobSeekerRepository = new Lazy<IJobSeekerRepository>(() => new JobSeekerRepository(repositoryContext));
            _skillRepository = new Lazy<ISkillRepository>(() => new SkillRepository(repositoryContext));
            _userRepository = new Lazy<IUserRepository>(() => new UserRepository(repositoryContext));
        }

        public ICompanyRepository Company => _companyRepository.Value;
        public IAdministratorRepository Administrator => _administratorRepository.Value;
        public IEmployeeRepository Employee => _employeeRepository.Value;
        public IJobApplicationRepository JobApplication => _jobApplicationRepository.Value;
        public IJobPostRepository JobPost => _jobPostRepository.Value;
        public IJobSeekerRepository JobSeeker => _jobSeekerRepository.Value;
        public ISkillRepository Skill => _skillRepository.Value;
        public IUserRepository User => _userRepository.Value;
        public async Task SaveAsync() =>  await _repositoryContext.SaveChangesAsync();
    }
}
