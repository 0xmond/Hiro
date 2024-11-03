using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Skill
    {
        [Column("SkillId")]
        public int Id { get; set; }
        [Required]
        [MaxLength(15, ErrorMessage = "Max length of skill name is 15 characters")]
        public string SkillName { get; set; }
        public ICollection<JobSeeker>? JobSeekers { get; set; }
    }
}
