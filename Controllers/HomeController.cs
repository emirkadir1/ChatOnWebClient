using ChatOnWebClient.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authentication;
using System.Text.Json;
using System.Text;
using NuGet.Common;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http.Headers;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Xml.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.AspNetCore.Authentication.Cookies;
using ChatOnWebClient.Client;
using Microsoft.AspNetCore.SignalR.Client;
using ChatOnWebApi.Services;

namespace ChatOnWebClient.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {

        public IActionResult IndexAsync()
        {
            return View();
        }
        public IActionResult Message()
        {
            var token= HttpClients._httpClient.DefaultRequestHeaders.Authorization.Parameter;
            if (token != null)
            {
                var userName = TokenService.GetName(token);
                ViewBag.UserName = userName;
            }
            return View();
        }
   
        [Route("{userName}")]
        public async Task<IActionResult> UserProfile(string userName)
        {
            var response = await HttpClients._httpClient.GetAsync($"https://localhost:7212/api/User/{userName}");
            string content = await response.Content.ReadAsStringAsync();
            if(string.IsNullOrEmpty(content)) 
            { 
            return View("Error");
            }
            else
            {
                User user = JsonConvert.DeserializeObject<User>(content);
                return View(user);
            }      
        }

        public IActionResult Message2()
        {
            return View();
        }
    
        public IActionResult EditProfile()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
       public IActionResult FriendShip()
        {
            return View();
        }
    }
}