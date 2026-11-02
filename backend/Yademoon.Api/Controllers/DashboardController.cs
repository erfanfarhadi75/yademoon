using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yademoon.Application.Dtos;
using Yademoon.Application.Services;

namespace Yademoon.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public sealed class DashboardController : ControllerBase
{
    private readonly PeopleService _people;

    public DashboardController(PeopleService people) => _people = people;

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> Get(CancellationToken ct)
    {
        var dto = await _people.GetDashboardAsync(ct);
        return Ok(dto);
    }
}
