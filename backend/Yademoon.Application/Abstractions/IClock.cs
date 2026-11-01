namespace Yademoon.Application.Abstractions;

public interface IClock
{
    DateOnly Today { get; }
    DateTimeOffset UtcNow { get; }
}
