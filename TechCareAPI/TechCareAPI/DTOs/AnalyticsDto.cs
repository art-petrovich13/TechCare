namespace TechCareAPI.DTOs;

public class SummaryDto
{
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int InProgressOrders { get; set; }
    public int NewOrders { get; set; }
    public int CancelledOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AvgOrderPrice { get; set; }
    public double AvgRepairDays { get; set; }
    public int TotalClients { get; set; }
    public int NewClientsThisPeriod { get; set; }
}

public class OrdersByPeriodDto
{
    public string Label { get; set; } = "";
    public int Count { get; set; }
    public decimal Revenue { get; set; }
}

public class TopServiceDto
{
    public string ServiceName { get; set; } = "";
    public int UsageCount { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class EmployeeLoadDto
{
    public string EmployeeName { get; set; } = "";
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class DeviceTypeStatDto
{
    public string DeviceType { get; set; } = "";
    public int Count { get; set; }
}

