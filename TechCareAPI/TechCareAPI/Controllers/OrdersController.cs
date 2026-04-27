using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCareAPI.Data;
using TechCareAPI.DTOs;
using TechCareAPI.Models;

namespace TechCareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    public OrdersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAll()
    {
        var list = await _db.Orders
            .Include(o => o.Device).ThenInclude(d => d.Client)
            .Include(o => o.Employee)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                DeviceId = o.DeviceId,
                DeviceInfo = o.Device.Brand + " " + o.Device.Model,
                ClientName = o.Device.Client.FullName,
                EmployeeId = o.EmployeeId,
                EmployeeName = o.Employee != null ? o.Employee.FullName : null,
                Description = o.Description,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                TotalPrice = o.TotalPrice,
                CompletedAt = o.CompletedAt,
            }).ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var o = await _db.Orders
            .Include(x => x.Device).ThenInclude(d => d.Client)
            .Include(x => x.Employee)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (o == null) return NotFound();
        return Ok(new OrderDto
        {
            Id = o.Id,
            DeviceId = o.DeviceId,
            DeviceInfo = o.Device.Brand + " " + o.Device.Model,
            ClientName = o.Device.Client.FullName,
            EmployeeId = o.EmployeeId,
            EmployeeName = o.Employee?.FullName,
            Description = o.Description,
            Status = o.Status,
            CreatedAt = o.CreatedAt,
            UpdatedAt = o.UpdatedAt,
            TotalPrice = o.TotalPrice,
            CompletedAt = o.CompletedAt,
        });
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderDto dto)
    {
        var order = new Order
        {
            DeviceId = dto.DeviceId,
            EmployeeId = dto.EmployeeId,
            Description = dto.Description,
            Status = dto.Status
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = order.Id },
            new OrderDto
            {
                Id = order.Id,
                DeviceId = order.DeviceId,
                Description = order.Description,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateOrderDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.DeviceId = dto.DeviceId;
        order.EmployeeId = dto.EmployeeId;
        order.Description = dto.Description;
        order.TotalPrice = dto.TotalPrice;  
        order.UpdatedAt = DateTime.UtcNow;

        if (dto.Status == "done" && order.CompletedAt == null)
            order.CompletedAt = DateTime.UtcNow;

        if (dto.Status != "done")
            order.CompletedAt = null;

        order.Status = dto.Status;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();
        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
