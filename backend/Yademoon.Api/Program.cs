using Microsoft.EntityFrameworkCore;
using Yademoon.Api.Controllers;
using Yademoon.Infrastructure;
using Yademoon.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ProductOptions>(
    builder.Configuration.GetSection(ProductOptions.SectionName));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddYademoonInfrastructure(builder.Configuration);

var frontendOrigin = builder.Configuration["Frontend:Origin"] ?? "http://localhost:4200";
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins(frontendOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.IsRelational())
        await db.Database.MigrateAsync();
    else
        await db.Database.EnsureCreatedAsync();
}

app.Run();

public partial class Program;
