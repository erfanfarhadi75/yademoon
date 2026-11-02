using Microsoft.EntityFrameworkCore;
using Yademoon.Application.Abstractions;
using Yademoon.Domain;

namespace Yademoon.Infrastructure.Persistence;

public sealed class PersonRepository : IPersonRepository
{
    private readonly AppDbContext _db;

    public PersonRepository(AppDbContext db) => _db = db;

    public Task<Person?> GetByIdAsync(Guid id, string ownerUserId, CancellationToken ct = default) =>
        _db.People.FirstOrDefaultAsync(p => p.Id == id && p.OwnerUserId == ownerUserId, ct);

    public async Task<IReadOnlyList<Person>> ListByOwnerAsync(string ownerUserId, CancellationToken ct = default) =>
        await _db.People.AsNoTracking()
            .Where(p => p.OwnerUserId == ownerUserId)
            .ToListAsync(ct);

    public Task AddAsync(Person person, CancellationToken ct = default)
    {
        _db.People.Add(person);
        return Task.CompletedTask;
    }

    public void Remove(Person person) => _db.People.Remove(person);

    public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        _db.SaveChangesAsync(ct);
}
