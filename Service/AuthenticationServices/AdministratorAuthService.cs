using AutoMapper;
using Contracts;
using Entities.Models;
using Entities.Models.Profiles;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Service.Contracts.AuthenticationServices.Contracts;
using Shared.DataTransferObjects.AuthenticationDTOs;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.AuthenticationServices
{
    internal sealed class AdministratorAuthService : IAdministratorAuthService
    {
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly IRepositoryManager _repositoryManager;

        public AdministratorAuthService(ILoggerManager logger, IMapper mapper, IConfiguration configuration, UserManager<User> userManager, IRepositoryManager repository)
        {
            _logger = logger;
            _mapper = mapper;
            _configuration = configuration;
            _userManager = userManager;
            _repositoryManager = repository;
        }
        public async Task<IdentityResult> CreateAdministratorAsync(AdministratorForCreationDto admin)
        {
            var user = _mapper.Map<User>(admin);

            var result = await _userManager.CreateAsync(user, admin.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRolesAsync(user, ["Administrator"]);
                var administrator = new AdministratorProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    CreatedAt = DateTime.Now,
                };
                _repositoryManager.Administrator.CreateAdmin(administrator);

                await _repositoryManager.SaveAsync();
            }

            return result;
        }
    }
}
