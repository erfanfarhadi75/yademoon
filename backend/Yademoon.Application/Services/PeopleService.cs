using Yademoon.Application.Abstractions;
using Yademoon.Application.Dtos;
using Yademoon.Domain;

namespace Yademoon.Application.Services;

public sealed class PeopleService
{
    private readonly IPersonRepository _people;
    private readonly ICurrentUser _currentUser;
    private readonly IClock _clock;

    public PeopleService(IPersonRepository people, ICurrentUser currentUser, IClock clock)
    {
        _people = people;
        _currentUser = currentUser;
        _clock = clock;
    }

    private string RequireUserId() =>
        _currentUser.UserId ?? throw new UnauthorizedAccessException("ورود لازم است.");

    public async Task<IReadOnlyList<PersonDto>> ListAsync(
        string? search = null,
        RelationType? relation = null,
        string sort = "days",
        CancellationToken ct = default)
    {
        var ownerId = RequireUserId();
        var today = _clock.Today;
        var list = await _people.ListByOwnerAsync(ownerId, ct);
        IEnumerable<Person> query = list;

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(p => p.Name.Contains(s, StringComparison.OrdinalIgnoreCase));
        }

        if (relation is not null)
            query = query.Where(p => p.Relation == relation);

        var dtos = query.Select(p => PersonMapper.ToDto(p, today)).ToList();

        dtos = sort switch
        {
            "name" => dtos.OrderBy(p => p.Name, StringComparer.OrdinalIgnoreCase).ToList(),
            "relation" => dtos.OrderBy(p => p.Relation).ThenBy(p => p.DaysUntil).ToList(),
            _ => dtos.OrderBy(p => p.DaysUntil).ThenBy(p => p.Name).ToList()
        };

        return dtos;
    }

    public async Task<PersonDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var ownerId = RequireUserId();
        var person = await _people.GetByIdAsync(id, ownerId, ct);
        return person is null ? null : PersonMapper.ToDto(person, _clock.Today);
    }

    public async Task<(PersonDto? Dto, string? Error)> CreateAsync(CreatePersonRequest request, CancellationToken ct = default)
    {
        var ownerId = RequireUserId();
        var error = Validate(request.Name, request.BirthDate, out var birthDate);
        if (error is not null) return (null, error);

        var now = _clock.UtcNow;
        var person = new Person
        {
            Id = Guid.NewGuid(),
            OwnerUserId = ownerId,
            Name = request.Name.Trim(),
            Relation = request.Relation,
            BirthDate = birthDate,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        await _people.AddAsync(person, ct);
        await _people.SaveChangesAsync(ct);
        return (PersonMapper.ToDto(person, _clock.Today), null);
    }

    public async Task<(PersonDto? Dto, string? Error, bool NotFound)> UpdateAsync(
        Guid id, UpdatePersonRequest request, CancellationToken ct = default)
    {
        var ownerId = RequireUserId();
        var person = await _people.GetByIdAsync(id, ownerId, ct);
        if (person is null) return (null, null, true);

        var error = Validate(request.Name, request.BirthDate, out var birthDate);
        if (error is not null) return (null, error, false);

        person.Name = request.Name.Trim();
        person.Relation = request.Relation;
        person.BirthDate = birthDate;
        person.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        person.UpdatedAt = _clock.UtcNow;

        await _people.SaveChangesAsync(ct);
        return (PersonMapper.ToDto(person, _clock.Today), null, false);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var ownerId = RequireUserId();
        var person = await _people.GetByIdAsync(id, ownerId, ct);
        if (person is null) return false;
        _people.Remove(person);
        await _people.SaveChangesAsync(ct);
        return true;
    }

    public async Task<DashboardDto> GetDashboardAsync(CancellationToken ct = default)
    {
        var ownerId = RequireUserId();
        var today = _clock.Today;
        var people = await _people.ListByOwnerAsync(ownerId, ct);
        var dtos = people.Select(p => PersonMapper.ToDto(p, today)).OrderBy(p => p.DaysUntil).ToList();

        var todayList = dtos.Where(p => p.DaysUntil == 0).ToList();
        var upcoming = dtos.Where(p => p.DaysUntil is > 0 and <= 30).ToList();

        var todayJalali = NextBirthdayCalculator.ToJalali(today);
        var thisMonth = dtos
            .Where(p =>
            {
                var next = DateOnly.ParseExact(p.NextBirthday, "yyyy-MM-dd");
                var nj = NextBirthdayCalculator.ToJalali(next);
                return nj.Month == todayJalali.Month && nj.Year == todayJalali.Year;
            })
            .ToList();

        return new DashboardDto(
            _currentUser.DisplayName ?? "دوست",
            dtos.Count,
            todayList.Count,
            upcoming.Count,
            thisMonth.Count,
            todayList,
            upcoming,
            thisMonth,
            dtos.FirstOrDefault());
    }

    private static string? Validate(string name, string birthDate, out DateOnly date)
    {
        date = default;
        if (string.IsNullOrWhiteSpace(name) || name.Trim().Length < 2)
            return "نام باید حداقل ۲ حرف باشد.";
        if (name.Trim().Length > 100)
            return "نام خیلی طولانی است.";
        if (!DateOnly.TryParseExact(birthDate, "yyyy-MM-dd", out date))
            return "تاریخ تولد باید به صورت YYYY-MM-DD باشد.";
        if (date > DateOnly.FromDateTime(DateTime.UtcNow.Date))
            return "تاریخ تولد نمی‌تواند در آینده باشد.";
        return null;
    }
}
