using Yademoon.Domain;

namespace Yademoon.Application.Abstractions;

public interface IPersonRepository
{
    Task<Person?> GetByIdAsync(Guid id, string ownerUserId, CancellationToken ct = default);
    Task<IReadOnlyList<Person>> ListByOwnerAsync(string ownerUserId, CancellationToken ct = default);
    Task AddAsync(Person person, CancellationToken ct = default);
    void Remove(Person person);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
