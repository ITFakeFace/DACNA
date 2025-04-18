using System.Security.Claims;

namespace EVOLEC_Server.Middlewares
{
    public class FakeAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public FakeAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            Console.WriteLine("FakeAuthenticationMiddleware đang chạy...");
            // Bạn có thể fake 1 user như sau
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, "dev"),
                new Claim(ClaimTypes.Role, "Admin")
            };
            var identity = new ClaimsIdentity(claims, "Fake");
            var principal = new ClaimsPrincipal(identity);
            context.User = principal;
            Console.WriteLine("FakeAuthenticationMiddleware kết thúc ...");

            await _next(context);
        }
    }

}
