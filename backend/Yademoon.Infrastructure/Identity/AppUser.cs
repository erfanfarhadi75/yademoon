using Microsoft.AspNetCore.Identity;

namespace Yademoon.Infrastructure.Identity;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
}
