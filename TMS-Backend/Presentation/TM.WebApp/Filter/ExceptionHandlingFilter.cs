using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TM.Buisness.CustomErrors;

namespace TM.WebApp.Filter
{
    public class ExceptionHandlingFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is NotFoundException nf)
            {
                context.Result = new NotFoundObjectResult(nf.Message);
                context.ExceptionHandled = true;
            }
            else if (context.Exception is ValidationException ve)
            {
                context.Result = new BadRequestObjectResult(ve.Message);
                context.ExceptionHandled = true;
            }
        }
    }
}
