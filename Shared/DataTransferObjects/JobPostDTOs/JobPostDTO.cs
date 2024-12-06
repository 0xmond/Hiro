using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.JobPostDTOs
{
    public record JobPostDTO
    {
        //"companyId": "aa4a4e02-6e66-4ffb-743f-08dd145002c0",
        //"jobTitle": "asdasd",
        //"jobDescription": "asdasd",
        //"location": "asdasddas",
        //"salaryRange": "asdasdasd",
        //"postedDate": "2006-12-01T00:00:00",
        //"applicationDeadLine": "2005-03-12T00:00:00",
        //"company": null,
        //"jobApplications": null
        public Guid Id { get; init; }
        public Guid CompanyId { get; init; }
        public string JobTitle { get; init; }
        public string JobDescription { get; init; }
        public string Location { get; init; }
        public string SalaryRange { get; init; }
        public DateTime ApplicationDeadLine { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
