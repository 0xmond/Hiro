namespace Shared.DataTransferObjects.JobPostDTOs
{
    public class JobPostRegisterDTO
    {
        public Guid CompanyId { get; set; }
        public string JobTitle { get; set; }
        public string JobDescription { get; set; }
        public string Location { get; set; }
        public string? SalaryRange { get; set; }
        public JobType Type { get; set; }
        public Experience Level { get; set; }
        public DateTime ApplicationDeadLine { get; set; }
    }
    public enum JobType
    {
        FullTime,
        PartTime,
        Hybrid
    }

    public enum Experience
    {
        Fresher,
        Intermediate,
        Expert,
        NoExperience,
        Internship
    }
}
