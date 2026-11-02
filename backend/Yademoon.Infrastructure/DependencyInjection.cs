using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Yademoon.Application.Abstractions;
using Yademoon.Application.Services;
using Yademoon.Infrastructure.Identity;
using Yademoon.Infrastructure.Persistence;
using Yademoon.Infrastructure.Services;

namespace Yademoon.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddYademoonInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Connection string 'Default' is missing.");

        var inMemoryName = configuration["Database:InMemoryName"] ?? "Yademoon";
        services.AddDbContext<AppDbContext>(options =>
        {
            if (string.Equals(connectionString, "InMemory", StringComparison.OrdinalIgnoreCase))
                options.UseInMemoryDatabase(inMemoryName);
            else
                options.UseNpgsql(connectionString);
        });

        services
            .AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.Name = "yademoon.auth";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Lax;
            options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.SameAsRequest;
            options.SlidingExpiration = true;
            options.ExpireTimeSpan = TimeSpan.FromDays(14);
            options.Events.OnRedirectToLogin = ctx =>
            {
                ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };
            options.Events.OnRedirectToAccessDenied = ctx =>
            {
                ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddSingleton<IClock, SystemClock>();
        services.AddScoped<IPersonRepository, PersonRepository>();
        services.AddScoped<PeopleService>();

        return services;
    }
}
