using Microsoft.AspNetCore.Http.HttpResults;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public UserDTO RegisterUser(UserDTO userDto)
    {
        var user = new User { Name = userDto.Name, Email = userDto.Email };
        _userRepository.Add(user);
        return userDto;
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _userRepository.GetById(id);
        return user != null ? new UserDTO { Name = user.Name, Email = user.Email } : null;
    }

    public UserDTO[] GetAllUsers()
    {
        var users = _userRepository.ListAll();
        var userDTOs = new List<UserDTO>();

        foreach(var user in users)
        {
            userDTOs.Add(new UserDTO { Id = user.Id, Name = user.Name, Email = user.Email });
        }

        return userDTOs.ToArray();
    }
    //update
     public UserDTO UpdateUser(int id, UserDTO userDto)
    {

        var user = _userRepository.GetById(id);
        if(user == null){
            return null;
        }
       user.Name = userDto.Name;
       user.Email = userDto.Email;
        _userRepository.Update(user);

        return new UserDTO
     {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email
    };
    }

    public void DeleteUser(int id)
    {
        var user = _userRepository.GetById(id);
        _userRepository.Delete(user);
    }
}