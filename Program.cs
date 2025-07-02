using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Azure SQL Database bağlantısını ekle
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS servisini ekle - Angular uygulaması için
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Google Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = "Google";
})
.AddCookie()
.AddGoogle("Google", options =>
{
    options.ClientId = builder.Configuration["GoogleAuth:ClientId"] ?? "";
    options.ClientSecret = builder.Configuration["GoogleAuth:ClientSecret"] ?? "";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// CORS middleware'ini ekle - DİĞER MIDDLEWARE'LERDEN ÖNCE!
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();