using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Rentora.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Rentora.BusinessLayer.Helpers;

public class JwtHelper
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtHelper(IConfiguration config)
    {
        _key      = config["Jwt:Key"]!;
        _issuer   = config["Jwt:Issuer"]!;
        _audience = config["Jwt:Audience"]!;
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             _issuer,
            audience:           _audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(2), 
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}