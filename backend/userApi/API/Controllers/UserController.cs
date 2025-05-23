using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public IActionResult RegisterUser(UserDTO userDto)
    {
        var result = _userService.RegisterUser(userDto);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetUserDetails(int id)
    {
        var user = _userService.GetUserDetails(id);
        return user != null ? Ok(user) : NotFound();
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, UserDTO userDTO){
        if(id != userDTO.Id ){
            return BadRequest();
        }
        
        var user = _userService.UpdateUser(id, userDTO);
        if(user == null){
            return NotFound();
        }
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        try{
            _userService.DeleteUser(id);
            return Ok();
        }catch(Exception){
            return BadRequest();
        }
    }
}