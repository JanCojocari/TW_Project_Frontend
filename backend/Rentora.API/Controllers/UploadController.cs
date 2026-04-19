namespace Rentora.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/uploads")]
[ApiController]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB per fisier
    private const int  MaxFiles         = 12;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost("images")]
    public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest("Nu au fost trimise fisiere.");

        if (files.Count > MaxFiles)
            return BadRequest($"Maxim {MaxFiles} imagini per anunt.");

        var webRoot = _env.WebRootPath 
                      ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsFolder);

        var urls = new List<string>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            if (file.Length > MaxFileSizeBytes)
                return BadRequest($"Fisierul '{file.FileName}' depaseste limita de 10 MB.");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest($"Extensia '{ext}' nu este permisa. Acceptate: jpg, jpeg, png, webp.");

            // Nume unic pentru a evita coliziunile
            var fileName  = $"{Guid.NewGuid()}{ext}";
            var filePath  = Path.Combine(uploadsFolder, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            // URL accesibil din frontend: /uploads/numefisier.jpg
            urls.Add($"/uploads/{fileName}");
        }

        return Ok(urls);
    }
}