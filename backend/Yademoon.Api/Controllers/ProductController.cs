using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Yademoon.Api.Controllers;

public sealed class ProductOptions
{
    public const string SectionName = "Product";
    public string DisplayName { get; set; } = "یادمون";
    public string Version { get; set; } = "0.1.0";
}

[ApiController]
[Route("api/product")]
public sealed class ProductController : ControllerBase
{
    private readonly ProductOptions _options;

    public ProductController(IOptions<ProductOptions> options) => _options = options.Value;

    [HttpGet]
    [AllowAnonymous]
    public ActionResult<object> Get() =>
        Ok(new { displayName = _options.DisplayName, version = _options.Version });
}
