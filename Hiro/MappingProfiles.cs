using AutoMapper;
using Entities.Models;
using Entities.Models.Profiles;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.AuthenticationDTOs;
using Shared.DataTransferObjects.JobPostDTOs;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Hiro
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<CompanyForCreationDto, CompanyProfile>().ReverseMap();
            CreateMap<CompanyDto, CompanyProfile>().ReverseMap();
            CreateMap<AdministratorForCreationDto, User>().ReverseMap();
            CreateMap<JobPost, JobPostDTO>().ReverseMap();
        }
    }
}
