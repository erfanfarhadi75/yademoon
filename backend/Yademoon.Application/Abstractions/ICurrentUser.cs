namespace Yademoon.Application.Abstractions;

public interface ICurrentUser
{
    string? UserId { get; }
    string? DisplayName { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
}
