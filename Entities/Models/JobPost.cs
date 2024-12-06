using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities.Models.Profiles;

namespace Entities.Models
{
    public class JobPost
    {
        [Column("JobId")]
        public Guid Id { get; set; }
        [ForeignKey(nameof(Company))]
        public Guid CompanyId { get; set; }

        public string JobTitle { get; set; }
        public string JobDescription { get; set; }
        public string Location { get; set; }
        public string? SalaryRange { get; set; }
        public enum JobType
        {
            FullTime,
            PartTime,
            Hybrid
        }
        public enum Experience
        {
            Fresher,
            Intermediate,
            Expert,
            NoExperience,
            Internship
        } 
        public DateTime ApplicationDeadLine { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public CompanyProfile? Company { get; set; }
        public ICollection<JobApplication>? JobApplications { get; set; }
    }
}
