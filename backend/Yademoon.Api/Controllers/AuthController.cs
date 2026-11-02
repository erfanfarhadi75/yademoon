using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Yademoon.Application.Dtos;
using Yademoon.Infrastructure.Identity;

namespace Yademoon.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly SignInManager<AppUser> _signIn;

    public AuthController(UserManager<AppUser> users, SignInManager<AppUser> signIn)
    {
        _users = users;
        _signIn = signIn;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DisplayName) || request.DisplayName.Trim().Length < 2)
            return BadRequest(new { message = "نام نمایشی نامعتبر است." });
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
            return BadRequest(new { message = "ایمیل نامعتبر است." });
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            return BadRequest(new { message = "رمز عبور باید حداقل ۸ کاراکتر باشد." });

        var user = new AppUser
        {
            UserName = request.Email.Trim().ToLowerInvariant(),
            Email = request.Email.Trim().ToLowerInvariant(),
            DisplayName = request.DisplayName.Trim()
        };

        var result = await _users.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var msg = result.Errors.FirstOrDefault()?.Description ?? "ثبت‌نام ناموفق بود.";
            return BadRequest(new { message = msg });
        }

        await _users.AddClaimAsync(user, new Claim("display_name", user.DisplayName));
        await _signIn.SignInAsync(user, isPersistent: true);
        return Ok(new AuthResponse(ToDto(user)));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "ایمیل و رمز عبور لازم است." });

        var user = await _users.FindByEmailAsync(request.Email.Trim().ToLowerInvariant());
        if (user is null)
            return Unauthorized(new { message = "ایمیل یا رمز عبور اشتباه است." });

        var result = await _signIn.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "ایمیل یا رمز عبور اشتباه است." });

        await _signIn.SignInAsync(user, isPersistent: true);
        return Ok(new AuthResponse(ToDto(user)));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _signIn.SignOutAsync();
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponse>> Me()
    {
        var user = await _users.GetUserAsync(User);
        if (user is null) return Unauthorized();
        return Ok(new AuthResponse(ToDto(user)));
    }

    private static AuthUserDto ToDto(AppUser user) =>
        new(user.Id, user.DisplayName, user.Email ?? string.Empty);
}
