using Yademoon.Application.Abstractions;

namespace Yademoon.Infrastructure.Services;

public sealed class SystemClock : IClock
{
    public DateOnly Today => DateOnly.FromDateTime(DateTime.UtcNow.Date);
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
