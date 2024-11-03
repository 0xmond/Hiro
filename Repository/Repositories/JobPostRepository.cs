using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts;
using Entities.Models;

namespace Repository.Repositories
{
    public class JobPostRepository : RepositoryBase<JobPost>, IJobPostRepository
    {
        public JobPostRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
