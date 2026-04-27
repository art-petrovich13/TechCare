using Microsoft.EntityFrameworkCore;
using TechCareAPI.Models;

namespace TechCareAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderService> OrderServices => Set<OrderService>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>().ToTable("clients");
        modelBuilder.Entity<Employee>().ToTable("employees");
        modelBuilder.Entity<Device>().ToTable("devices");
        modelBuilder.Entity<Service>().ToTable("services");
        modelBuilder.Entity<Order>().ToTable("orders");
        modelBuilder.Entity<OrderService>().ToTable("order_services");

        // Маппинг полей (snake_case → PascalCase)
        modelBuilder.Entity<Client>(e => {
            e.Property(c => c.FullName).HasColumnName("full_name");
            e.Property(c => c.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Employee>(e => {
            e.Property(x => x.FullName).HasColumnName("full_name");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Device>(e => {
            e.Property(x => x.ClientId).HasColumnName("client_id");
            e.Property(x => x.DeviceType).HasColumnName("device_type");
            e.Property(x => x.SerialNumber).HasColumnName("serial_number");
            e.HasOne(d => d.Client)
             .WithMany(c => c.Devices)
             .HasForeignKey(d => d.ClientId);
        });

        modelBuilder.Entity<Order>(e => {
            e.Property(x => x.DeviceId).HasColumnName("device_id");
            e.Property(x => x.EmployeeId).HasColumnName("employee_id");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.HasOne(o => o.Device)
             .WithMany(d => d.Orders)
             .HasForeignKey(o => o.DeviceId);
            e.HasOne(o => o.Employee)
             .WithMany(em => em.Orders)
             .HasForeignKey(o => o.EmployeeId)
             .IsRequired(false);
        });

        modelBuilder.Entity<OrderService>(e => {
            e.Property(x => x.OrderId).HasColumnName("order_id");
            e.Property(x => x.ServiceId).HasColumnName("service_id");
            e.HasOne(os => os.Order)
             .WithMany(o => o.OrderServices)
             .HasForeignKey(os => os.OrderId);
            e.HasOne(os => os.Service)
             .WithMany(s => s.OrderServices)
             .HasForeignKey(os => os.ServiceId);
        });
    }
}
