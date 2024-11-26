using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities.Models.Profiles;

namespace Entities.Models
{
    public class JobApplication
    {
        [Column("ApplicationId")]
        public Guid Id { get; set; }
        [ForeignKey(nameof(JobPost))]
        public Guid JobPostId { get; set; }
        [ForeignKey(nameof(JobSeeker))]
        public Guid JobSeekerId { get; set; }

        public DateTime SubmittedAt { get; set; }
        public enum ApplicationStatus
        {
            InProgress,
            UnderConsideration,
            Interviewed,
            Rejected,
            Offer,
            Hired
        }
        public JobSeekerProfile JobSeeker { get; set; }
        public JobPost JobPost { get; set; }
    }
}
