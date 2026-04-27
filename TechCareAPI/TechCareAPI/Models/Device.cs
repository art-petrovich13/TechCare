namespace TechCareAPI.Models;

public class Device
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string DeviceType { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }

    public Client Client { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
