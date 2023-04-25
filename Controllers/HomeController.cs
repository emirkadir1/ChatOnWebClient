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

using Microsoft.AspNetCore.SignalR.Client;
using ChatOnWebApi.Services;

namespace ChatOnWebClient.Controllers
{

    public class HomeController : Controller
    {
        private  HttpClient _httpClient;
        public HomeController(IHttpClientFactory httpClientFactory)
        {
            // Singleton HttpClient nesnesi alınır
            _httpClient = httpClientFactory.CreateClient("HttpClient");
        }
        public async Task<IActionResult> Index()
        {
            ClaimsPrincipal claimUser = HttpContext.User;
            if (claimUser.Identity.IsAuthenticated)
            {
                return RedirectToAction("Message");
            }
            
            var response = await _httpClient.GetAsync("https://localhost:7212/api/user/auto-login");
            if (response.IsSuccessStatusCode)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwt = await response.Content.ReadAsStringAsync();
                if (jwt != " ")
                {
                    //   _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    // Token'ı doğrulayınü,
                    var key = Encoding.UTF8.GetBytes("my top secret key");
                    var tokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };

                    SecurityToken validatedToken;
                    var claimsPrincipal = tokenHandler.ValidateToken(jwt, tokenValidationParameters, out validatedToken);

                    // Claims'leri okuyun ve Authentication işlemini gerçekleştirin
                    var nameClaim = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name");
                    if (nameClaim != null)
                    {
                        //Sign In in Client
                        SignIn(nameClaim.Value, jwt);
                        //Http Client For Api Requests
                        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
                    }
                    return RedirectToAction("Message");
                }

            }
            return View();

        }
        [HttpPost]
        public async Task<IActionResult> Login(Login login)
        {
            string username = login.UserName;
            string password = login.Password;
            var loginModel = new { username, password };
            var loginJson = System.Text.Json.JsonSerializer.Serialize(loginModel);
            var httpContent = new StringContent(loginJson, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://localhost:7212/api/user/login", httpContent);

            if (response.IsSuccessStatusCode)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwt = await response.Content.ReadAsStringAsync();
                //   _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                // Token'ı doğrulayınü,
                var key = Encoding.UTF8.GetBytes("my top secret key");
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                SecurityToken validatedToken;
                var claimsPrincipal = tokenHandler.ValidateToken(jwt, tokenValidationParameters, out validatedToken);

                // Claims'leri okuyun ve Authentication işlemini gerçekleştirin
                var nameClaim = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name");
                if (nameClaim != null)
                {
                    //Sign In in Client
                    SignIn(nameClaim.Value,jwt);
                    //Http Client For Api Requests
                }
                return RedirectToAction("Message");

            }


            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Register(Login login)
        {
            string userName = login.UserName;
            string password = login.Password;
            string email = login.Email;
            string confirmPassword = login.ConfirmPassword;
            var registerModel = new { userName, email, password, confirmPassword };
            var registerJson = System.Text.Json.JsonSerializer.Serialize(registerModel);
            var httpContent = new StringContent(registerJson, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7212/api/user/register", httpContent);

            if (response.IsSuccessStatusCode)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwt = await response.Content.ReadAsStringAsync();
                //   _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                // Token'ı doğrulayınü,
                var key = Encoding.UTF8.GetBytes("my top secret key");
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                SecurityToken validatedToken;
                var claimsPrincipal = tokenHandler.ValidateToken(jwt, tokenValidationParameters, out validatedToken);

                // Claims'leri okuyun ve Authentication işlemini gerçekleştirin
                var nameClaim = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name");
                if (nameClaim != null)
                {
                    //Sign In in Client
                    SignIn(nameClaim.Value, jwt);
                    //Http Client For Api Requests
                    _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
                }
                return RedirectToAction("FirstTimeEditProfile");

            }


            return View();
        }
        private void SignIn(string user,string jwt)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,user),
            };
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            AuthenticationProperties properties = new AuthenticationProperties()
            {
                AllowRefresh = true,
                IsPersistent = false
            };
            HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);

        }
        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            await _httpClient.GetAsync("https://localhost:7212/api/user/delete-refresh-token");
            return RedirectToAction("Index");
        }
        public IActionResult FirstTimeEditProfile()
        {
            var userName = HttpContext.User.Identity.Name;
            if (userName != null)
            {
                ViewBag.UserName = userName;
            }
            return View();
        }
        public IActionResult SetProfile()
        {
            return RedirectToAction("FirstTimeEditProfile");
        }

        //Sign In Olmuş Kullanıcı
        [Authorize]
        public IActionResult Message()
        {

            var userName= HttpContext.User.Identity.Name;
            if (userName != null)
            {
                ViewBag.UserName = userName;
            }
            return View();
        }
        [Authorize]
        [Route("{userName}")]
        public async Task<IActionResult> UserProfile(string userName)
        {
            
            var response = await _httpClient.GetAsync($"https://localhost:7212/api/User/{userName}");
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
        [Authorize]
        public IActionResult EditProfile()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [Authorize]
        public IActionResult FriendShip()
        {
            var userName = HttpContext.User.Identity.Name;
            if (userName != null)
            {
                ViewBag.UserName = userName;
            }
            return View();
        }
    }
}