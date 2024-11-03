using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Entities.Models
{
    public class User : IdentityUser
    {
        [Required(ErrorMessage = "First name is a required field.")]
        [MaxLength(15, ErrorMessage = "Maximum length for the first name is 15 characters.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is a required field.")]
        [MaxLength(15, ErrorMessage = "Maximum length for the last name is 15 characters.")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Age is a required field.")]
        public int? Age { get; set; }
        public DateTime CreationDate { get; set; }
        public JobSeeker? JobSeeker { get; set; }
        public Employee? Employee { get; set; }
        public Administrator? Administrator { get; set; }
        public Company? Company { get; set; }

    }
}

/*
 * public string FullName { get; set; }

    // Navigation properties
    public virtual JobSeekerProfile JobSeekerProfile { get; set; }
    public virtual EmployerProfile EmployerProfile { get; set; }
*/
