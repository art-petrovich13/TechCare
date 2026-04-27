namespace TechCareAPI.DTOs
{
    public class ReportDto
    {
        public string Period { get; set; } = "";
        public SummaryDto Summary { get; set; } = new();
        public List<OrdersByPeriodDto> ByMonth { get; set; } = new();
        public List<TopServiceDto> TopServices { get; set; } = new();
        public List<EmployeeLoadDto> EmployeeLoad { get; set; } = new();
        public List<DeviceTypeStatDto> DeviceTypes { get; set; } = new();
    }
}
