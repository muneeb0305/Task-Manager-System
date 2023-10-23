using TM.Buisness.Interfaces;

namespace TM.Buisness.CustomErrors
{
    public class Errors : IErrors
    {
        public void Validate(bool condition, string Message)
        {
            if (condition)
            {
                throw new ValidationException(Message);
            }
        }
        public void NotFound(bool condition, string message)
        {
            if (condition)
            {
                throw new NotFoundException(message);
            }
        }

        public void ThrowFailureError(string errorMessage)
        {
            throw new Exception(errorMessage);
        }
    }
}
