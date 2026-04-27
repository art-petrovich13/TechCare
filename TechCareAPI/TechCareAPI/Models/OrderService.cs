namespace TechCareAPI.Models;

public class OrderService
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ServiceId { get; set; }
    public int Quantity { get; set; } = 1;

    public Order Order { get; set; } = null!;
    public Service Service { get; set; } = null!;
}
