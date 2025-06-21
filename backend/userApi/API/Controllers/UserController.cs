using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
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

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetUserDetails(int id)
    {
        var user = _userService.GetUserDetails(id);
        return user != null ? Ok(user) : NotFound();
    }
    [Authorize]
    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }
    [Authorize]
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

    [Authorize]
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