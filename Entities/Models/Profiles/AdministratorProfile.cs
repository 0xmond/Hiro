using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models.Profiles
{
    public class AdministratorProfile
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(User))]
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public User? User { get; set; }
    }
}
