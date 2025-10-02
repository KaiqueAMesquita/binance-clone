public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public UserDTO RegisterUser(UserDTO userDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var user = new User
        {
            Name = userDto.Name,
            Email = userDto.Email,
            Phone = userDto.Phone,
            Address = userDto.Address,
            Password = hashedPassword,
            Photo = userDto.Photo
        };
        _userRepository.Add(user);

        return new UserDTO
        {
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        };
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _userRepository.GetById(id);
        return user != null
            ? new UserDTO
            {
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Password = user.Password,
                Photo = user.Photo
            }
            : null;
    }

    public UserDTO[] GetAllUsers()
    {
        var users = _userRepository.ListAll();
        var userDTOs = new List<UserDTO>();

        foreach (var user in users)
        {
            userDTOs.Add(new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Password = user.Password,
                Photo = user.Photo
            });
        }

        return userDTOs.ToArray();
    }

    public UpdateUserDTO? UpdateUser(int id, UpdateUserDTO userDto)
    {
        var user = _userRepository.GetById(id);
        if (user == null)
        {
            return null;
        }

        if (userDto.Name != null)
        {
            user.Name = userDto.Name;
        }

        if (userDto.Email != null)
        {
            user.Email = userDto.Email;
        }

        if (userDto.Phone != null)
        {
            user.Phone = userDto.Phone;
        }

        if (userDto.Address != null)
        {
            user.Address = userDto.Address;
        }

        if (!string.IsNullOrEmpty(userDto.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        }

        if (userDto.Photo != null)
        {
            user.Photo = userDto.Photo;
        }

        _userRepository.Update(user);

        return new UpdateUserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }

    public void DeleteUser(int id)
    {
        var user = _userRepository.GetById(id);
        if (user == null)
        {
            throw new KeyNotFoundException($"Usuário com o id {id} não encontrado.");
        }

        _userRepository.Delete(user);
    }

    public UserDTO? ValidateUser(string email, string password)
    {
        var user = _userRepository.GetByEmail(email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            return null;
        }

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }
}
