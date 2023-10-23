namespace TM.WebApp.Middleware
{
    public class NotFoundEndpoint
    {
        private readonly RequestDelegate next;
        public NotFoundEndpoint(RequestDelegate next)
        {
            this.next = next;
        }
        public async Task Invoke(HttpContext context)
        {
            var endPoint = context.GetEndpoint();
            if (endPoint == null)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                await context.Response.WriteAsJsonAsync(new { Message = "Resource Not Found" });
            }
            else
            {
                await next(context);
            }
        }
    }
}
