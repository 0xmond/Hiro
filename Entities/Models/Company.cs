using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Company
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(User))]
        public string UserId { get; set; }
        [Column("CompanyId")]
        public string CompanyName { get; set; }
        public ICollection<Employee> Employees { get; set; }
        public User User { get; set; }
        public ICollection<JobPost> JobPosts { get; set; }

    }
}
