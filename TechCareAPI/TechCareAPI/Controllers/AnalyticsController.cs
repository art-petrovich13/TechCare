using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCareAPI.Data;
using TechCareAPI.DTOs;

namespace TechCareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AnalyticsController(AppDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<ActionResult<SummaryDto>> GetSummary(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var dateFrom = from?.ToUniversalTime() ?? DateTime.MinValue;
        var dateTo = to?.ToUniversalTime() ?? DateTime.UtcNow;

        var orders = await _db.Orders
            .Where(o => o.CreatedAt >= dateFrom && o.CreatedAt <= dateTo)
            .ToListAsync();

        var completedWithDates = orders
            .Where(o => o.Status == "done" && o.CompletedAt.HasValue)
            .ToList();

        double avgDays = completedWithDates.Any()
            ? completedWithDates
                .Average(o => (o.CompletedAt!.Value - o.CreatedAt).TotalDays)
            : 0;

        int newClients = await _db.Clients
            .CountAsync(c => c.CreatedAt >= dateFrom && c.CreatedAt <= dateTo);

        var dto = new SummaryDto
        {
            TotalOrders = orders.Count,
            CompletedOrders = orders.Count(o => o.Status == "done"),
            InProgressOrders = orders.Count(o => o.Status == "in_progress"),
            NewOrders = orders.Count(o => o.Status == "new"),
            CancelledOrders = orders.Count(o => o.Status == "cancelled"),
            TotalRevenue = orders.Sum(o => o.TotalPrice),
            AvgOrderPrice = orders.Any(o => o.TotalPrice > 0)
                                     ? orders.Where(o => o.TotalPrice > 0)
                                             .Average(o => o.TotalPrice)
                                     : 0,
            AvgRepairDays = Math.Round(avgDays, 1),
            TotalClients = await _db.Clients.CountAsync(),
            NewClientsThisPeriod = newClients,
        };

        return Ok(dto);
    }

    [HttpGet("orders-by-month")]
    public async Task<ActionResult<List<OrdersByPeriodDto>>> GetOrdersByMonth(
        [FromQuery] int? year)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;

        var raw = await _db.Orders
            .Where(o => o.CreatedAt.Year == targetYear)
            .GroupBy(o => o.CreatedAt.Month)
            .Select(g => new
            {
                Month = g.Key,
                Count = g.Count(),
                Revenue = g.Sum(o => o.TotalPrice)
            })
            .OrderBy(x => x.Month)
            .ToListAsync();

        var allMonths = Enumerable.Range(1, 12).Select(m =>
        {
            var found = raw.FirstOrDefault(r => r.Month == m);
            return new OrdersByPeriodDto
            {
                Label = new DateTime(targetYear, m, 1).ToString("MMM",
                              new System.Globalization.CultureInfo("ru-RU")),
                Count = found?.Count ?? 0,
                Revenue = found?.Revenue ?? 0,
            };
        }).ToList();

        return Ok(allMonths);
    }

    [HttpGet("orders-by-day")]
    public async Task<ActionResult<List<OrdersByPeriodDto>>> GetOrdersByDay(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var dateFrom = from.ToUniversalTime();
        var dateTo = to.ToUniversalTime();

        if ((dateTo - dateFrom).TotalDays > 90)
            return BadRequest("Диапазон не должен превышать 90 дней.");

        var raw = await _db.Orders
            .Where(o => o.CreatedAt >= dateFrom && o.CreatedAt <= dateTo)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Count = g.Count(),
                Revenue = g.Sum(o => o.TotalPrice)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        var result = new List<OrdersByPeriodDto>();
        for (var d = dateFrom.Date; d <= dateTo.Date; d = d.AddDays(1))
        {
            var found = raw.FirstOrDefault(r => r.Date == d);
            result.Add(new OrdersByPeriodDto
            {
                Label = d.ToString("dd.MM"),
                Count = found?.Count ?? 0,
                Revenue = found?.Revenue ?? 0,
            });
        }

        return Ok(result);
    }

    [HttpGet("top-services")]
    public async Task<ActionResult<List<TopServiceDto>>> GetTopServices(
        [FromQuery] int limit = 10)
    {
        var data = await _db.OrderServices
            .Include(os => os.Service)
            .GroupBy(os => new { os.ServiceId, os.Service.Name, os.Service.Price })
            .Select(g => new TopServiceDto
            {
                ServiceName = g.Key.Name,
                UsageCount = g.Sum(os => os.Quantity),
                TotalRevenue = g.Sum(os => os.Quantity * g.Key.Price)
            })
            .OrderByDescending(x => x.UsageCount)
            .Take(limit)
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("employee-load")]
    public async Task<ActionResult<List<EmployeeLoadDto>>> GetEmployeeLoad()
    {
        var data = await _db.Orders
            .Where(o => o.EmployeeId != null)
            .Include(o => o.Employee)
            .GroupBy(o => new { o.EmployeeId, o.Employee!.FullName })
            .Select(g => new EmployeeLoadDto
            {
                EmployeeName = g.Key.FullName,
                TotalOrders = g.Count(),
                CompletedOrders = g.Count(o => o.Status == "done"),
                TotalRevenue = g.Sum(o => o.TotalPrice)
            })
            .OrderByDescending(x => x.TotalOrders)
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("device-types")]
    public async Task<ActionResult<List<DeviceTypeStatDto>>> GetDeviceTypes()
    {
        var data = await _db.Orders
            .Include(o => o.Device)
            .GroupBy(o => o.Device.DeviceType)
            .Select(g => new DeviceTypeStatDto
            {
                DeviceType = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("report")]
    public async Task<ActionResult<ReportDto>> GetReport(
    [FromQuery] DateTime from,
    [FromQuery] DateTime to)
    {
        var dateFrom = from.ToUniversalTime();
        var dateTo = to.ToUniversalTime();

        var summaryResult = await GetSummary(from, to);
        var byMonthResult = await GetOrdersByMonth(dateFrom.Year);
        var topServicesResult = await GetTopServices(10);
        var employeeLoadResult = await GetEmployeeLoad();
        var deviceTypesResult = await GetDeviceTypes();

        var period = $"{from:dd.MM.yyyy}–{to:dd.MM.yyyy}";

        var report = new ReportDto
        {
            Period = period,
            Summary = GetValueFromActionResult<SummaryDto>(summaryResult),
            ByMonth = GetValueFromActionResult<List<OrdersByPeriodDto>>(byMonthResult),
            TopServices = GetValueFromActionResult<List<TopServiceDto>>(topServicesResult),
            EmployeeLoad = GetValueFromActionResult<List<EmployeeLoadDto>>(employeeLoadResult),
            DeviceTypes = GetValueFromActionResult<List<DeviceTypeStatDto>>(deviceTypesResult),
        };

        return Ok(report);
    }

    private T? GetValueFromActionResult<T>(ActionResult<T> actionResult)
    {
        if (actionResult.Result is OkObjectResult okResult && okResult.Value is T value)
            return value;

        if (actionResult.Value is T directValue)
            return directValue;

        return default;
    }
}