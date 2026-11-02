using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yademoon.Application.Dtos;
using Yademoon.Application.Services;
using Yademoon.Domain;

namespace Yademoon.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/people")]
public sealed class PeopleController : ControllerBase
{
    private readonly PeopleService _people;

    public PeopleController(PeopleService people) => _people = people;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PersonDto>>> List(
        [FromQuery] string? search,
        [FromQuery] RelationType? relation,
        [FromQuery] string sort = "days",
        CancellationToken ct = default)
    {
        var result = await _people.ListAsync(search, relation, sort, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PersonDto>> Get(Guid id, CancellationToken ct)
    {
        var person = await _people.GetAsync(id, ct);
        return person is null ? NotFound() : Ok(person);
    }

    [HttpPost]
    public async Task<ActionResult<PersonDto>> Create([FromBody] CreatePersonRequest request, CancellationToken ct)
    {
        if (!Enum.IsDefined(request.Relation))
            return BadRequest(new { message = "رابطه نامعتبر است." });

        var (dto, error) = await _people.CreateAsync(request, ct);
        if (error is not null) return BadRequest(new { message = error });
        return CreatedAtAction(nameof(Get), new { id = dto!.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PersonDto>> Update(Guid id, [FromBody] UpdatePersonRequest request, CancellationToken ct)
    {
        if (!Enum.IsDefined(request.Relation))
            return BadRequest(new { message = "رابطه نامعتبر است." });

        var (dto, error, notFound) = await _people.UpdateAsync(id, request, ct);
        if (notFound) return NotFound();
        if (error is not null) return BadRequest(new { message = error });
        return Ok(dto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _people.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}
