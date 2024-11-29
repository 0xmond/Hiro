using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Entities.Models.Profiles;

namespace Entities.Models
{
    public class User : IdentityUser
    {
        public AdministratorProfile? Administrator { get; set; }
        public EmployeeProfile? Employee{ get; set; }
        public CompanyProfile? Company{ get; set; }
        public JobSeekerProfile? JobSeeker { get; set; }
    }
}
