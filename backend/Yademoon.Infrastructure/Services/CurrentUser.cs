using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Yademoon.Application.Abstractions;

namespace Yademoon.Infrastructure.Services;

public sealed class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _http;

    public CurrentUser(IHttpContextAccessor http) => _http = http;

    private ClaimsPrincipal? User => _http.HttpContext?.User;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;
    public string? UserId => User?.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? Email => User?.FindFirstValue(ClaimTypes.Email) ?? User?.Identity?.Name;
    public string? DisplayName =>
        User?.FindFirstValue("display_name")
        ?? User?.FindFirstValue(ClaimTypes.GivenName)
        ?? User?.Identity?.Name;
}
