public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
    UserDTO[] GetAllUsers();
    UserDTO? UpdateUser(int id, UserDTO userDto);
    void DeleteUser(int id);
    UserDTO? ValidateUser(string email, string password);
}