using Entities.Models;
using Entities.Models.Profiles;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Repository.Configurations;
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

            modelBuilder.Entity<AdministratorProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Administrator)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CompanyProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Company)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CompanyProfile>()
                .HasMany(p => p.JobPosts)
                .WithOne(u => u.Company)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EmployeeProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Employee)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EmployeeProfile>()
                .HasMany(p => p.Skills)
                .WithMany(u => u.Employees);


            modelBuilder.Entity<JobSeekerProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.JobSeeker)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobSeekerProfile>()
                .HasMany(p => p.Skills)
                .WithMany(u => u.JobSeekers);

            modelBuilder.Entity<JobSeekerProfile>()
                .HasMany(p => p.JobApplications)
                .WithOne(u => u.JobSeeker)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobApplication>()
                .HasOne(p => p.JobPost)
                .WithMany(u => u.JobApplications)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<JobPost>()
                .HasOne(p => p.Company)
                .WithMany(u => u.JobPosts)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.ApplyConfiguration(new RoleConfiguration());

            modelBuilder.Entity<JobPost>()
                .Property(p => p.CreatedAt)
                .HasDefaultValue(DateTime.Now);

            modelBuilder.Entity<JobPost>()
                .Property(p => p.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnUpdate();

            
        }

        public DbSet<EmployeeProfile>? Employees { get; set; }
        public DbSet<JobSeekerProfile>? JobSeekers { get; set; }
        public DbSet<AdministratorProfile>? Administrators { get; set; }
        public DbSet<Skill>? Skills { get; set; }
        public DbSet<JobPost>? JobPosts { get; set; }
        public DbSet<JobApplication>? JobApplications { get; set; }

        DbSet<User>? Users { get; set; }
        DbSet<AdministratorProfile>? AdministratorProfiles { get; set; }
    }
}
