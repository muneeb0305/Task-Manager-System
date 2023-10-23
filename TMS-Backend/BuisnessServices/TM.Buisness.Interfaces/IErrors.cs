namespace TM.Buisness.Interfaces
{
    public interface IErrors
    {
        void Validate(bool condition, string message);
        void NotFound(bool condition, string message);
        void ThrowFailureError(string errorMessage);
    }
}
