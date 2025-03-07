public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
    UserDTO[] GetAllUsers();
    void DeleteUser(int id);
}