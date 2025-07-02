using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/Register
        [HttpPost("Register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            try
            {
                // Email kontrolü
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Bu email adresi zaten kullanılıyor."
                    });
                }

                // Şifreyi hash'le
                var passwordHash = HashPassword(request.Password);

                // Yeni kullanıcı oluştur
                var user = new User
                {
                    Name = request.Name,
                    Surname = request.Surname,
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    Country = request.Country,
                    City = request.City
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Kullanıcı başarıyla kayıt oldu.",
                    User = user
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = $"Kayıt sırasında hata oluştu: {ex.Message}"
                });
            }
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            try
            {
                // Kullanıcıyı bul
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Email veya şifre hatalı."
                    });
                }

                // Şifreyi kontrol et
                var hashedPassword = HashPassword(request.Password);
                if (user.PasswordHash != hashedPassword)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Email veya şifre hatalı."
                    });
                }

                // Basit token oluştur (gerçek projede JWT kullanılmalı)
                var token = GenerateSimpleToken(user.UserID, user.Email);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Giriş başarılı.",
                    User = user,
                    Token = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = $"Giriş sırasında hata oluştu: {ex.Message}"
                });
            }
        }

        // GET: api/Auth/GoogleLogin
        [HttpGet("GoogleLogin")]
        public IActionResult GoogleLogin(string returnUrl = "/")
        {
            var redirectUrl = Url.Action("GoogleResponse", "Auth", new { returnUrl });
            var properties = new Microsoft.AspNetCore.Authentication.AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, "Google");
        }

        // GET: api/Auth/GoogleResponse
        [HttpGet("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse(string returnUrl = "/")
        {
            var authenticateResult = await HttpContext.AuthenticateAsync();
            if (!authenticateResult.Succeeded)
                return BadRequest();

            var email = authenticateResult.Principal.FindFirst(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            var name = authenticateResult.Principal.Identity.Name;

            // Burada kullanıcıyı veritabanında bulabilir veya otomatik kayıt edebilirsin
            // Örnek olarak sadece email ve name döndürüyorum
            return Ok(new { email, name });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private string GenerateSimpleToken(int userId, string email)
        {
            // Basit token oluşturma (gerçek projede JWT kullanılmalı)
            var tokenData = $"{userId}:{email}:{DateTime.UtcNow.Ticks}";
            var tokenBytes = Encoding.UTF8.GetBytes(tokenData);
            return Convert.ToBase64String(tokenBytes);
        }
    }
} 