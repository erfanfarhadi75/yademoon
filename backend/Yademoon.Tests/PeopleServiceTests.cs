using FluentAssertions;
using Yademoon.Application.Abstractions;
using Yademoon.Application.Dtos;
using Yademoon.Application.Services;
using Yademoon.Domain;

namespace Yademoon.Tests;

public class PeopleServiceTests
{
    private sealed class FakeClock : IClock
    {
        public required DateOnly Today { get; init; }
        public DateTimeOffset UtcNow => new(Today.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
    }

    private sealed class FakeCurrentUser : ICurrentUser
    {
        public string? UserId { get; set; } = "user-a";
        public string? DisplayName { get; set; } = "ارغوان";
        public string? Email { get; set; } = "a@example.com";
        public bool IsAuthenticated => UserId is not null;
    }

    private sealed class InMemoryPeople : IPersonRepository
    {
        private readonly List<Person> _items = [];

        public Task<Person?> GetByIdAsync(Guid id, string ownerUserId, CancellationToken ct = default) =>
            Task.FromResult(_items.FirstOrDefault(p => p.Id == id && p.OwnerUserId == ownerUserId));

        public Task<IReadOnlyList<Person>> ListByOwnerAsync(string ownerUserId, CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Person>>(_items.Where(p => p.OwnerUserId == ownerUserId).ToList());

        public Task AddAsync(Person person, CancellationToken ct = default)
        {
            _items.Add(person);
            return Task.CompletedTask;
        }

        public void Remove(Person person) => _items.Remove(person);

        public Task<int> SaveChangesAsync(CancellationToken ct = default) => Task.FromResult(1);

        public void Seed(params Person[] people) => _items.AddRange(people);
    }

    private static (PeopleService Svc, InMemoryPeople Repo, FakeCurrentUser User, FakeClock Clock) Create(
        DateOnly? today = null)
    {
        var repo = new InMemoryPeople();
        var user = new FakeCurrentUser();
        var clock = new FakeClock { Today = today ?? new DateOnly(2024, 6, 15) };
        return (new PeopleService(repo, user, clock), repo, user, clock);
    }

    [Fact]
    public async Task Create_and_get_person_crud()
    {
        var (svc, _, _, _) = Create();
        var (created, err) = await svc.CreateAsync(new CreatePersonRequest(
            "مینا", RelationType.Friend, "1995-03-20", null));
        err.Should().BeNull();
        created!.Name.Should().Be("مینا");

        var got = await svc.GetAsync(created.Id);
        got!.Id.Should().Be(created.Id);

        var (updated, uerr, nf) = await svc.UpdateAsync(created.Id, new UpdatePersonRequest(
            "مینا جان", RelationType.Family, "1995-03-20", "یادداشت"));
        nf.Should().BeFalse();
        uerr.Should().BeNull();
        updated!.Name.Should().Be("مینا جان");
        updated.Notes.Should().Be("یادداشت");

        (await svc.DeleteAsync(created.Id)).Should().BeTrue();
        (await svc.GetAsync(created.Id)).Should().BeNull();
    }

    [Fact]
    public async Task Ownership_isolation_hides_other_users_people()
    {
        var (svc, repo, user, clock) = Create();
        repo.Seed(new Person
        {
            Id = Guid.NewGuid(),
            OwnerUserId = "user-b",
            Name = "مخفی",
            Relation = RelationType.Other,
            BirthDate = new DateOnly(1990, 1, 1),
            CreatedAt = clock.UtcNow,
            UpdatedAt = clock.UtcNow
        });

        var list = await svc.ListAsync();
        list.Should().BeEmpty();

        var (mine, _) = await svc.CreateAsync(new CreatePersonRequest(
            "خودم", RelationType.Friend, "1991-02-02", null));
        user.UserId = "user-b";
        (await svc.GetAsync(mine!.Id)).Should().BeNull();
        (await svc.DeleteAsync(mine.Id)).Should().BeFalse();
    }

    [Fact]
    public async Task Empty_dashboard_returns_zero_counts()
    {
        var (svc, _, _, _) = Create();
        var dash = await svc.GetDashboardAsync();
        dash.TotalPeople.Should().Be(0);
        dash.TodayCount.Should().Be(0);
        dash.UpcomingCount.Should().Be(0);
        dash.ThisMonthCount.Should().Be(0);
        dash.Nearest.Should().BeNull();
        dash.GreetingName.Should().Be("ارغوان");
    }

    [Fact]
    public async Task Dashboard_groups_today_and_upcoming()
    {
        var today = NextBirthdayCalculator.ToGregorianSafe(1403, 3, 20);
        var birthToday = NextBirthdayCalculator.ToGregorianSafe(1370, 3, 20);
        var birthSoon = NextBirthdayCalculator.ToGregorianSafe(1370, 3, 25);
        var (svc, repo, _, clock) = Create(today);
        repo.Seed(
            new Person
            {
                Id = Guid.NewGuid(),
                OwnerUserId = "user-a",
                Name = "امروز",
                Relation = RelationType.Family,
                BirthDate = birthToday,
                CreatedAt = clock.UtcNow,
                UpdatedAt = clock.UtcNow
            },
            new Person
            {
                Id = Guid.NewGuid(),
                OwnerUserId = "user-a",
                Name = "نزدیک",
                Relation = RelationType.Friend,
                BirthDate = birthSoon,
                CreatedAt = clock.UtcNow,
                UpdatedAt = clock.UtcNow
            });

        var dash = await svc.GetDashboardAsync();
        dash.TodayCount.Should().Be(1);
        dash.UpcomingCount.Should().Be(1);
        dash.Nearest!.Name.Should().Be("امروز");
    }
}
