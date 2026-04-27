using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCareAPI.Data;
using TechCareAPI.DTOs;
using TechCareAPI.Models;

namespace TechCareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ControllerBase
{
    private readonly AppDbContext _db;
    public DevicesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<DeviceDto>>> GetAll()
    {
        var list = await _db.Devices
            .Include(d => d.Client)
            .Select(d => new DeviceDto
            {
                Id = d.Id,
                ClientId = d.ClientId,
                ClientName = d.Client.FullName,
                DeviceType = d.DeviceType,
                Brand = d.Brand,
                Model = d.Model,
                SerialNumber = d.SerialNumber
            }).ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DeviceDto>> GetById(int id)
    {
        var d = await _db.Devices.Include(x => x.Client).FirstOrDefaultAsync(x => x.Id == id);
        if (d == null) return NotFound();
        return Ok(new DeviceDto
        {
            Id = d.Id,
            ClientId = d.ClientId,
            ClientName = d.Client.FullName,
            DeviceType = d.DeviceType,
            Brand = d.Brand,
            Model = d.Model,
            SerialNumber = d.SerialNumber
        });
    }

    [HttpPost]
    public async Task<ActionResult<DeviceDto>> Create(CreateDeviceDto dto)
    {
        var dev = new Device
        {
            ClientId = dto.ClientId,
            DeviceType = dto.DeviceType,
            Brand = dto.Brand,
            Model = dto.Model,
            SerialNumber = dto.SerialNumber
        };
        _db.Devices.Add(dev);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = dev.Id },
            new DeviceDto
            {
                Id = dev.Id,
                ClientId = dev.ClientId,
                DeviceType = dev.DeviceType,
                Brand = dev.Brand,
                Model = dev.Model,
                SerialNumber = dev.SerialNumber
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateDeviceDto dto)
    {
        var dev = await _db.Devices.FindAsync(id);
        if (dev == null) return NotFound();
        dev.ClientId = dto.ClientId; dev.DeviceType = dto.DeviceType;
        dev.Brand = dto.Brand; dev.Model = dto.Model; dev.SerialNumber = dto.SerialNumber;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var dev = await _db.Devices.FindAsync(id);
        if (dev == null) return NotFound();
        _db.Devices.Remove(dev);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
