using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Reflection;
using System.Text;
using TM.Buisness.CustomErrors;
using TM.Buisness.DataServices;
using TM.Buisness.Interfaces;
using TM.Data;
using TM.Data.Interfaces;
using TM.WebApp.Filter;
using TM.WebApp.Middleware;

namespace TM.WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            //configure EF Core
            builder.Services.AddDbContext<TaskManagerContext>(options =>
            {
                //string conn = builder.Configuration.GetValue<string>("ConnectionStrings:TMS-Database")!;
                var conn = builder.Configuration.GetConnectionString("TMS-DataBase");
                options.UseSqlServer(conn);
            });
            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new BuisnessEntityMapping());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);
            // custom configuration
            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<ExceptionHandlingFilter>();
            });
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<ITeamService, TeamService>();
            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddScoped<ITaskService, TaskService>();
            builder.Services.AddScoped<ICommentService, CommentService>();
            builder.Services.AddScoped<IErrors, Errors>();

            //Jwt Authentication
            builder.Services.AddAuthentication().AddJwtBearer(options =>
            {
                var config = builder.Configuration.GetSection("Jwt");
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Key"]!));

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = securityKey,
                    ValidateIssuer = true,
                    ValidIssuer = config["Audience"],
                    ValidateAudience = true,
                    ValidAudience = config["Issuer"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.Response.OnStarting(() =>
                        {
                            if (context.Exception is SecurityTokenExpiredException)
                            {
                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                context.Response.ContentType = "application/json";
                                return context.Response.WriteAsJsonAsync(new { Message = "Token has expired" });
                            }
                            else
                            {
                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                context.Response.ContentType = "application/json";
                                return context.Response.WriteAsJsonAsync(new { Message = "Invalid Token" });
                            }
                        });
                        return Task.CompletedTask;
                    },

                    OnChallenge = context =>
                    {
                        if (string.IsNullOrEmpty(context.Request.Headers["Authorization"]))
                        {
                            context.Response.OnStarting(() =>
                            {
                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                context.Response.ContentType = "application/json";
                                return context.Response.WriteAsJsonAsync(new { Message = "Token Required" });
                            });
                        }
                        return Task.CompletedTask;
                    },

                    OnForbidden = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        return context.Response.WriteAsJsonAsync(new { Message = "Access Forbidden" });
                    }
                };
            });

            // Logger
            builder.Services.AddLogging(logger =>
            {
                logger.AddConsole();
            });

            //Swagger
            builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                });
                options.OperationFilter<SecurityRequirementsOperationFilter>();
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Task Manager System",
                });
                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API Documentation");
                c.RoutePrefix = string.Empty;
            });

            //Custom Middlewares
            app.UseMiddleware<ExceptionHandling>();
            app.UseMiddleware<NotFoundEndpoint>();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}