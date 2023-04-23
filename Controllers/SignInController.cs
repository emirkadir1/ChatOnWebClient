using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ChatOnWebClient.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using ChatOnWebClient.Client;
using System.Net.Http.Headers;
using NuGet.Protocol.Plugins;
using ChatOnWebApi.Services;

namespace ChatOnWebClient.Controllers
{
    public class SignInController : Controller
    {
        public async Task<IActionResult> Index()
        {
            ClaimsPrincipal claimUser = HttpContext.User;
            if (claimUser.Identity.IsAuthenticated)
            {
                return RedirectToAction("Message","Home");
            }
           var response= await HttpClients._httpClient.GetAsync("https://localhost:7212/api/user/auto-login");
            if(response.IsSuccessStatusCode)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwt = await response.Content.ReadAsStringAsync();
                if(jwt != " ")
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
                        SignIn(nameClaim.Value);
                        //Http Client For Api Requests
                        HttpClients._httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
                    }
                    return RedirectToAction("Message", "Home");
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

            var response = await HttpClients._httpClient.PostAsync("https://localhost:7212/api/user/login", httpContent);

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
                    SignIn(nameClaim.Value);
                    //Http Client For Api Requests
                    HttpClients._httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
                }
                return RedirectToAction("Message", "Home");

            }

            
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Register(Login login)
        {
            string userName = login.UserName;
            string password = login.Password;
            string email = login.Email;
            string confirmPassword= login.ConfirmPassword;
            var registerModel = new { userName, email, password , confirmPassword};
            var registerJson = System.Text.Json.JsonSerializer.Serialize(registerModel);
            var httpContent = new StringContent(registerJson, Encoding.UTF8, "application/json");

            var response = await HttpClients._httpClient.PostAsync("https://localhost:7212/api/user/register", httpContent);

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
                    SignIn(nameClaim.Value);
                    //Http Client For Api Requests
                    HttpClients._httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
                }
                return RedirectToAction("FirstTimeEditProfile");

            }


            return View();
        }
        private void SignIn(string user)
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


        }
        public async  Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpClients._httpClient.GetAsync("https://localhost:7212/api/user/delete-refresh-token");
            return RedirectToAction("Index", "SignIn");
        }
        public IActionResult FirstTimeEditProfile()
        {
            var token = HttpClients._httpClient.DefaultRequestHeaders.Authorization.Parameter;
            if (token != null)
            {
                var userName = TokenService.GetName(token);
                ViewBag.UserName = userName;
            }
            return View();
        }
        public  IActionResult SetProfile()
        {
            var a = "emir";
            return RedirectToAction("FirstTimeEditProfile");
        }
    
    }
}
