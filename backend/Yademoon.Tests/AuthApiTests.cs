using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Yademoon.Application.Dtos;
using Yademoon.Domain;

namespace Yademoon.Tests;

public class AuthApiTests : IClassFixture<AuthApiTests.YademoonFactory>
{
    private readonly YademoonFactory _factory;

    public AuthApiTests(YademoonFactory factory) => _factory = factory;

    private HttpClient CreateClient() =>
        _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });

    [Fact]
    public async Task Register_login_me_and_logout()
    {
        var client = CreateClient();
        var email = $"user_{Guid.NewGuid():N}@example.com";
        var register = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(
            "سارا", email, "Password1"));
        register.StatusCode.Should().Be(HttpStatusCode.OK);
        var regBody = await register.Content.ReadFromJsonAsync<AuthResponse>();
        regBody!.User.DisplayName.Should().Be("سارا");

        var me = await client.GetAsync("/api/auth/me");
        me.StatusCode.Should().Be(HttpStatusCode.OK);

        await client.PostAsync("/api/auth/logout", null);
        var me2 = await client.GetAsync("/api/auth/me");
        me2.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var login = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, "Password1"));
        login.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Ownership_enforced_across_users()
    {
        var client = CreateClient();
        var emailA = $"a_{Guid.NewGuid():N}@example.com";
        var reg = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("کاربر آ", emailA, "Password1"));
        reg.StatusCode.Should().Be(HttpStatusCode.OK);
        (await client.GetAsync("/api/auth/me")).StatusCode.Should().Be(HttpStatusCode.OK);

        var create = await client.PostAsJsonAsync("/api/people", new CreatePersonRequest(
            "فرزند آ", RelationType.Family, "2000-01-01", null));
        create.StatusCode.Should().Be(HttpStatusCode.Created);
        var person = await create.Content.ReadFromJsonAsync<PersonDto>();

        await client.PostAsync("/api/auth/logout", null);
        var emailB = $"b_{Guid.NewGuid():N}@example.com";
        var regB = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("کاربر ب", emailB, "Password1"));
        regB.StatusCode.Should().Be(HttpStatusCode.OK);
        (await client.GetAsync("/api/auth/me")).StatusCode.Should().Be(HttpStatusCode.OK);

        var get = await client.GetAsync($"/api/people/{person!.Id}");
        get.StatusCode.Should().Be(HttpStatusCode.NotFound);

        var del = await client.DeleteAsync($"/api/people/{person.Id}");
        del.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    public sealed class YademoonFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:Default"] = "InMemory",
                    ["Database:InMemoryName"] = $"yademoon_tests_{Guid.NewGuid():N}"
                });
            });
        }
    }
}
