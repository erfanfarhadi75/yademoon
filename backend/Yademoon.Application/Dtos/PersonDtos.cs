using Yademoon.Domain;

namespace Yademoon.Application.Dtos;

public sealed record PersonDto(
    Guid Id,
    string Name,
    RelationType Relation,
    string BirthDate,
    string? Notes,
    string NextBirthday,
    int DaysUntil,
    int JalaliBirthMonth,
    int JalaliBirthDay);

public sealed record CreatePersonRequest(
    string Name,
    RelationType Relation,
    string BirthDate,
    string? Notes);

public sealed record UpdatePersonRequest(
    string Name,
    RelationType Relation,
    string BirthDate,
    string? Notes);

public sealed record DashboardDto(
    string GreetingName,
    int TotalPeople,
    int TodayCount,
    int UpcomingCount,
    int ThisMonthCount,
    IReadOnlyList<PersonDto> Today,
    IReadOnlyList<PersonDto> Upcoming,
    IReadOnlyList<PersonDto> ThisMonth,
    PersonDto? Nearest);
