namespace TechCareAPI.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string DeviceInfo { get; set; } = string.Empty;  
    public string ClientName { get; set; } = string.Empty;
    public int? EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "new";
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CreateOrderDto
{
    public int DeviceId { get; set; }
    public int? EmployeeId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "new";
    public decimal TotalPrice { get; set; } = 0;
}
