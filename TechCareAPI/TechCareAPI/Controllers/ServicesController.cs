using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCareAPI.Data;
using TechCareAPI.DTOs;
using TechCareAPI.Models;

namespace TechCareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ServicesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ServiceDto>>> GetAll()
    {
        var list = await _db.Services
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price,
                Description = s.Description
            })
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetById(int id)
    {
        var s = await _db.Services.FindAsync(id);
        if (s == null) return NotFound();
        return Ok(new ServiceDto
        {
            Id = s.Id,
            Name = s.Name,
            Price = s.Price,
            Description = s.Description
        });
    }

    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create(CreateServiceDto dto)
    {
        var svc = new Service
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description
        };
        _db.Services.Add(svc);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = svc.Id },
            new ServiceDto
            {
                Id = svc.Id,
                Name = svc.Name,
                Price = svc.Price,
                Description = svc.Description
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateServiceDto dto)
    {
        var svc = await _db.Services.FindAsync(id);
        if (svc == null) return NotFound();
        svc.Name = dto.Name; svc.Price = dto.Price; svc.Description = dto.Description;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var svc = await _db.Services.FindAsync(id);
        if (svc == null) return NotFound();
        _db.Services.Remove(svc);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
