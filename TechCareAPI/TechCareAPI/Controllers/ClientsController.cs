using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCareAPI.Data;
using TechCareAPI.DTOs;
using TechCareAPI.Models;

namespace TechCareAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ClientsController(AppDbContext db) => _db = db;

    // GET /api/clients
    [HttpGet]
    public async Task<ActionResult<List<ClientDto>>> GetAll()
    {
        var clients = await _db.Clients
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ClientDto
            {
                Id = c.Id,
                FullName = c.FullName,
                Phone = c.Phone,
                Email = c.Email,
                CreatedAt = c.CreatedAt
            }).ToListAsync();
        return Ok(clients);
    }

    // GET /api/clients/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ClientDto>> GetById(int id)
    {
        var c = await _db.Clients.FindAsync(id);
        if (c == null) return NotFound();
        return Ok(new ClientDto
        {
            Id = c.Id,
            FullName = c.FullName,
            Phone = c.Phone,
            Email = c.Email,
            CreatedAt = c.CreatedAt
        });
    }

    // POST /api/clients
    [HttpPost]
    public async Task<ActionResult<ClientDto>> Create(CreateClientDto dto)
    {
        var client = new Client
        {
            FullName = dto.FullName,
            Phone = dto.Phone,
            Email = dto.Email
        };
        _db.Clients.Add(client);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = client.Id },
            new ClientDto
            {
                Id = client.Id,
                FullName = client.FullName,
                Phone = client.Phone,
                Email = client.Email,
                CreatedAt = client.CreatedAt
            });
    }

    // PUT /api/clients/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateClientDto dto)
    {
        var client = await _db.Clients.FindAsync(id);
        if (client == null) return NotFound();
        client.FullName = dto.FullName;
        client.Phone = dto.Phone;
        client.Email = dto.Email;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/clients/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var client = await _db.Clients.FindAsync(id);
        if (client == null) return NotFound();
        _db.Clients.Remove(client);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
