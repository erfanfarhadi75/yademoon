namespace Yademoon.Application.Dtos;

public sealed record RegisterRequest(string DisplayName, string Email, string Password);
public sealed record LoginRequest(string Email, string Password);
public sealed record AuthUserDto(string Id, string DisplayName, string Email);
public sealed record AuthResponse(AuthUserDto User);
