using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RepositoryContext : IdentityDbContext<User>
    {
        public RepositoryContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>()
                .ToTable("Users");
        }

        public DbSet<Employee>? Employees { get; set; } 
        public DbSet<JobSeeker>? JobSeekers { get; set; } 
        public DbSet<Administrator>? Administrators { get; set; }
        public DbSet<Skill>? Skills { get; set; }
        public DbSet<JobPost>? JobPosts { get; set; }
        public DbSet<JobApplication>? JobApplications { get; set; }
        public DbSet<Company>? Companies { get; set; }
    }
}
