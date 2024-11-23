using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class JobSeeker
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string Resume { get; set; }
        public string? GithubUrl { get; set; }
        public string? Website { get; set; }
        public ICollection<Skill> Skills { get; set; }
        public string Education { get; set; }
        public string WorkExperience { get; set; }
        public ICollection<JobApplication> JobApplications { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public User User { get; set; }
    }
}
