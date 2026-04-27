using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCareAPI.Data;
using TechCareAPI.DTOs;
using TechCareAPI.Models;

namespace TechCareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;
    public EmployeesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<EmployeeDto>>> GetAll()
    {
        var list = await _db.Employees
            .OrderBy(e => e.FullName)
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                FullName = e.FullName,
                Role = e.Role,
                Phone = e.Phone,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetById(int id)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e == null) return NotFound();
        return Ok(new EmployeeDto
        {
            Id = e.Id,
            FullName = e.FullName,
            Role = e.Role,
            Phone = e.Phone,
            CreatedAt = e.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> Create(CreateEmployeeDto dto)
    {
        var emp = new Employee
        {
            FullName = dto.FullName,
            Role = dto.Role,
            Phone = dto.Phone
        };
        _db.Employees.Add(emp);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = emp.Id },
            new EmployeeDto
            {
                Id = emp.Id,
                FullName = emp.FullName,
                Role = emp.Role,
                Phone = emp.Phone,
                CreatedAt = emp.CreatedAt
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateEmployeeDto dto)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        emp.FullName = dto.FullName; emp.Role = dto.Role; emp.Phone = dto.Phone;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        _db.Employees.Remove(emp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
