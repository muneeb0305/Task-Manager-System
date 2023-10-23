using Microsoft.EntityFrameworkCore;
using TM.Data.Models;

namespace TM.Data
{
    public class TaskManagerContext : DbContext
    {
        public TaskManagerContext(DbContextOptions<TaskManagerContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Team> Team { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, UserName = "Muneeb Ahmed", Email = "muneeb@gmail.com", Role = "admin", Password = BCrypt.Net.BCrypt.HashPassword("12345678") }
            );
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SeedData(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Team)
                .WithMany(t => t.UsersWorking)
                .HasForeignKey(u => u.TeamId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Project>()
                .HasOne(t => t.Team)
                .WithOne(t => t.Project)
                .HasForeignKey<Project>(p => p.TeamId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Tasks>()
                .HasOne(t=>t.AssignedUser)
                .WithMany(u=>u.AssignedTask)
                .HasForeignKey(u=>u.AssignedUserID)
                .OnDelete(DeleteBehavior.SetNull);

        }
    }
}