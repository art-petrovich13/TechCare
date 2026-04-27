namespace TechCareAPI.Models;

public class Order
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public int? EmployeeId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "new";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Device Device { get; set; } = null!;
    public Employee? Employee { get; set; }
    public ICollection<OrderService> OrderServices { get; set; } = new List<OrderService>();
}
