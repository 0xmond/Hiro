using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts;
using Entities.Models;

namespace Repository.Repositories
{
    public class JobSeekerRepository : RepositoryBase<JobSeeker>, IJobSeekerRepository
    {
        public JobSeekerRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
