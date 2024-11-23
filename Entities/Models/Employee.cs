using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Employee
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
        [ForeignKey(nameof(Company))]
        public Guid CompanyId { get; set; }
        public DateTime HireDate { get; set; }
        public string ProfilePictureUrl { get; set; }
        public ICollection<Skill> Skills { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User User { get; set; }

    }
}
