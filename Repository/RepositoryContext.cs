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

           //modelBuilder.Entity<AdministratorProfile>()
            //    .Property(p => p.CreatedAt)
            //    .HasDefaultValue(DateTime.Now);

            //modelBuilder.Entity<CompanyProfile>()
            //    .Property(p => p.CreatedAt)
            //    .HasDefaultValue(DateTime.Now);

            //modelBuilder.Entity<CompanyProfile>()
            //    .Property(p => p.UpdatedAt)
            //    .HasDefaultValue(DateTime.Now);

            //modelBuilder.Entity<EmployeeProfile>()
            //    .Property(p => p.CreatedAt)
            //    .HasDefaultValue(DateTime.Now);

            //modelBuilder.Entity<EmployeeProfile>()
            //    .Property(p => p.UpdatedAt)
            //    .HasDefaultValue(DateTime.Now);

            //modelBuilder.Entity<JobSeekerProfile>()
            //    .Property(p => p.UpdatedAt)
            //    .HasDefaultValue(DateTime.Now);

            //modelBuilder.Entity<JobSeekerProfile>()
            //    .Property(p => p.CreatedAt)
            //    .HasDefaultValue(DateTime.Now);


            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            
            //// JobSeeker Configuration
            //modelBuilder.Entity<JobSeeker>()
            //    .HasKey(js => js.Id);
            //modelBuilder.Entity<JobSeeker>()
            //    .HasOne(js => js.User)
            //    .WithOne(u => u.JobSeeker)
            //    .HasForeignKey<JobSeeker>(js => js.UserId).OnDelete(DeleteBehavior.NoAction);

            //// Employee Configuration
            //modelBuilder.Entity<Employee>()
            //    .HasKey(e => e.Id);
            //modelBuilder.Entity<Employee>()
            //    .HasOne(e => e.User)
            //    .WithOne(u => u.Employee)
            //    .HasForeignKey<Employee>(e => e.UserId).OnDelete(DeleteBehavior.NoAction);

            //// Employer Configuration
            //modelBuilder.Entity<Company>()
            //    .HasKey(emp => emp.Id);
            //modelBuilder.Entity<Company>()
            //    .HasOne(emp => emp.User)
            //    .WithOne(u => u.Company)
            //    .HasForeignKey<Company>(emp => emp.UserId).OnDelete(DeleteBehavior.NoAction);

            //// Administrator Configuration
            //modelBuilder.Entity<Administrator>()
            //    .HasKey(admin => admin.Id);
            //modelBuilder.Entity<Administrator>()
            //    .HasOne(admin => admin.User)
            //    .WithOne(u => u.Administrator)
            //    .HasForeignKey<Administrator>(admin => admin.UserId).OnDelete(DeleteBehavior.NoAction);

            //// Skill Configuration
            //modelBuilder.Entity<Skill>()
            //    .HasKey(s => s.Id);
            //modelBuilder.Entity<Skill>()
            //    .HasMany(s => s.JobSeekers) // Many-to-many relationship with JobSeeker
            //    .WithMany(js => js.Skills)
            //    .UsingEntity(j => j.ToTable("JobSeekerSkills"));

            //// JobPost Configuration
            //modelBuilder.Entity<JobPost>()
            //    .HasKey(jp => jp.Id);
            //modelBuilder.Entity<JobPost>()
            //    .HasOne(jp => jp.Company)
            //    .WithMany(emp => emp.JobPosts)
            //    .HasForeignKey(jp => jp.CompanyId).OnDelete(DeleteBehavior.NoAction);

            //// JobApplication Configuration
            //modelBuilder.Entity<JobApplication>()
            //    .HasKey(ja => ja.Id);
            //modelBuilder.Entity<JobApplication>()
            //    .HasOne(ja => ja.JobPost)
            //    .WithMany(jp => jp.JobApplications)
            //    .HasForeignKey(ja => ja.JobPostId).OnDelete(DeleteBehavior.NoAction);
            //modelBuilder.Entity<JobApplication>()
            //    .HasOne(ja => ja.JobSeeker)
            //    .WithMany(js => js.JobApplications)
            //    .HasForeignKey(ja => ja.JobSeekerId).OnDelete(DeleteBehavior.NoAction);

            
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
