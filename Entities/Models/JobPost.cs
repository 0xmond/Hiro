using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class JobPost
    {
        [Column("JobId")]
        public Guid Id { get; set; }
        [ForeignKey(nameof(Company))]
        public Guid CompanyId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public double Salary { get; set; }
        public string Location { get; set; }
        public Company Company { get; set; }
        public ICollection<JobApplication>? JobApplications { get; set; }
        //public JobSeeker JobStatus { get; set; }
    }
}
