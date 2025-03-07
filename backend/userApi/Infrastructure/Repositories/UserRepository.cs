public class UserRepository : IUserRepository
{
    private readonly UserDbContext _context;

    public UserRepository(UserDbContext context)
    {
        _context = context;
    }

    public void Add(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public User? GetById(int id) => _context.Users.Find(id);

    // Criando método como array function
    public List<User>? ListAll() => _context.Users?.ToList() ?? new List<User>();


     public void Update(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }
        _context.Users.Update(user);
        _context.SaveChanges();
    }
    
    // Criando método de forma tradicional
    // public List<User>? ListAll()
    // {
    //     return _context.Users?.ToList() ?? new List<User>();
    // }

    public void Delete(User user)
    {
        _context.Users.Remove(user);
        _context.SaveChanges();
    }
}
