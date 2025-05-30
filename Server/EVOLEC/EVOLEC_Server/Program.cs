using EVOLEC_Server.Data;
using EVOLEC_Server.Middlewares;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using EVOLEC_Server.Securities.Jwt;
using EVOLEC_Server.Services;
using EVOLEC_Server.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Principal;
using System.Text;


internal class Program
{
    private static async Task Main(string[] args)
    {
        Console.InputEncoding = Encoding.UTF8;
        Console.OutputEncoding = Encoding.UTF8;

        var builder = WebApplication.CreateBuilder(args);
        // Add Identity
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<EVOLECDbContext>()
            .AddDefaultTokenProviders();
        // Setting Authentication
        builder.Services.Configure<IdentityOptions>(options =>
        {
            // cấu hình mật khẩu
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 3;
            options.Password.RequiredUniqueChars = 1;

            // cấu hình Lock user
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(60);
            options.Lockout.MaxFailedAccessAttempts = 100;
            options.Lockout.AllowedForNewUsers = true;

            // Cấu hình cho user
            options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789-._@+";
            options.User.RequireUniqueEmail = true;

            // cấu hình đăng nhập
            options.SignIn.RequireConfirmedEmail = false;
            options.SignIn.RequireConfirmedPhoneNumber = false;
        });
        // Add DbContext
        builder.Services.AddDbContext<EVOLECDbContext>(options =>
            options.UseMySql(builder.Configuration.GetConnectionString("MySQLConnection"),
                ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MySQLConnection")))
        );

        // Bind configuration of JwtSettings
        var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
        builder.Services.Configure<JwtSettings>(jwtSettingsSection);
        var jwtSettings = jwtSettingsSection.Get<JwtSettings>();

        // Add JWT if Enable = true
        if (jwtSettings?.Enable == true)
        {
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtSettings.Audience,

                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            Console.WriteLine("📥 Nhận token: " + context.Request.Headers["Authorization"]);
                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine($"❌ JWT lỗi: {context.Exception.Message}");
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context =>
                        {
                            Console.WriteLine($"✅ JWT hợp lệ, user: {context.Principal.Identity.Name}");
                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddAuthorization();
        }

        // Add CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactClient",
                policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });

        // Add Swagger services
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new() { Title = "EVOLEC API", Version = "v1" });

            // Cấu hình xác thực JWT
            options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Description = "Nhập token theo định dạng: Bearer {your token}"
            });

            options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
            {
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                        Reference = new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            });
        });
        // Add AutoMapper
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        // Add Email Setting & Service
        builder.Services.Configure<SmtpSetting>(builder.Configuration.GetSection("SmtpSettings"));
        builder.Services.AddScoped<EmailService>();
        // Add Services and Repositories to the container
        // User Repository & Service
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IUserService, UserService>();
        // Course Repository & Service
        builder.Services.AddScoped<ICourseRepository, CourseRepository>();
        builder.Services.AddScoped<ICourseService, CourseService>();
        // Lesson Repository & Service
        builder.Services.AddScoped<ILessonRepository, LessonRepository>();
        builder.Services.AddScoped<ILessonService, LessonService>();
        // Lesson Off Dates Repository & Service
        builder.Services.AddScoped<ILessonOffDateRepository, LessonOffDateRepository>();
        builder.Services.AddScoped<ILessonOffDateService, LessonOffDateService>();
        // ClassRoom Repository & Service
        builder.Services.AddScoped<IClassRoomRepository, ClassRoomRepository>();
        builder.Services.AddScoped<IClassRoomService, ClassRoomService>();
        // LessonDate Repository & Service
        builder.Services.AddScoped<ILessonDateRepository, LessonDateRepository>();
        builder.Services.AddScoped<ILessonDateService, LessonDateService>();
        // OffDate Repository & Service
        builder.Services.AddScoped<IOffDateRepository, OffDateRepository>();
        builder.Services.AddScoped<IOffDateService, OffDateService>();
        // Room Repository & Service
        builder.Services.AddScoped<IRoomRepository, RoomRepository>();
        builder.Services.AddScoped<IRoomService, RoomService>();
        // Jwt Service
        builder.Services.AddScoped<JwtHelper>();
        // Add services to the container.
        builder.Services.AddScoped<JwtTokenGenerator>();
        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            await UserAndRoleSeeding.SeedRolesAndUsers(services);
        }
        // Middleware phải đúng thứ tự!
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        //app.UseHttpsRedirection();

        app.UseCors("AllowReactClient"); // nếu có gọi CORS
        // Only using middleware if Enable = true
        if (jwtSettings?.Enable == true)
        {
            app.UseAuthentication();
            app.UseAuthorization();
        }
        else
        {
            // Nếu không dùng JWT thì fake authentication để bỏ qua [Authorize]
            app.UseMiddleware<FakeAuthenticationMiddleware>();
            app.UseAuthorization();
        }

        app.MapControllers();

        app.Run();
    }
}