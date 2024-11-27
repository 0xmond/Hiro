using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models.Profiles
{
    public class CompanyProfile
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(User))]
        public string UserId { get; set; }
        public string CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? CompanyLogoUrl { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? AboutCompany { get; set; }
        public int? EmployeesCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public User? User { get; set; }
        public ICollection<JobPost>? JobPosts { get; set; }

    }
}
