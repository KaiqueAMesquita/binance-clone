public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
    UserDTO[] GetAllUsers();
    UpdateUserDTO? UpdateUser(int id, UpdateUserDTO userDto);
    void DeleteUser(int id);
    UserDTO? ValidateUser(string email, string password);
}