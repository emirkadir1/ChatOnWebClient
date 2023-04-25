"use strict";
//var connection = new signalR.HubConnectionBuilder().withUrl("/userservice").withAutomaticReconnect().build();
/*connection.on("redirect", function (url) {
    window.location.href = url;
});

connection.start();*/


//Register
document.getElementById("SignUp").addEventListener("click", function (event) {
    var userName = document.getElementById("userName").value;
    var email = document.getElementById("userEmail").value;
    var password = document.getElementById("userPassword").value;
    var confirmPassword = document.getElementById("confirmUserPassword").value;
    sendRegisterRequest(userName,email, password,confirmPassword);

    event.preventDefault();
});
//Send Register Request To Api
function sendRegisterRequest(userName,email,password,confirmPassword) {
    var apiUrl = 'https://localhost:7212/api/User/register'; // WebApi adresi

    // Kullanıcı adı ve şifre bilgilerini JSON formatına dönüştürün
    var requestData = { userName:userName, email:email, password:password, confirmPassword:confirmPassword };
    var jsonData = JSON.stringify(requestData);

    // HTTP POST isteği oluşturun ve isteği gönderin
    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: jsonData,
        success: function (responseData) {
            const expireDate = new Date(); // Geçerlilik süresi belirlenir
            expireDate.setTime(expireDate.getTime() + (1 * 60 * 60 * 1000)); // 1 saat
            const expires = "expires=" + expireDate.toUTCString();
            document.cookie = `userName=${userName};${expires};path=/`;
            window.location.href = '/Home/FirstTimeEditProfile';
        },
        error: function (errorData) {
            // İşlem hatalı olduğunda yapılacak işlemleri burada tanımlayabilirsiniz.
            alert('Register işlemi başarısız oldu. Lütfen kullanıcı adı ve şifrenizi kontrol edin.'+ errorData);
        }
    });
}
//Log In
document.getElementById("LogIn").addEventListener("click", function (event) {
    var userName = document.getElementById("userLogInUserName").value;
    var password = document.getElementById("userLogInPassword").value;

    sendLogInRequest(userName, password);

    event.preventDefault();
});
//Send Log In Request To Api
function sendLogInRequest(userName,password) {
    var apiUrl = 'https://localhost:7212/api/User/login'; // WebApi adresi

    // Kullanıcı adı ve şifre bilgilerini JSON formatına dönüştürün
    var requestData = {userName:userName, password: password};
    var jsonData = JSON.stringify(requestData);

    // HTTP POST isteği oluşturun ve isteği gönderin
    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: jsonData,
        success: function (responseData) {
            // İşlem başarılı olduğunda yapılacak işlemleri burada tanımlayabilirsiniz.
            // Örneğin, kullanıcının giriş yapması durumunda diğer sayfaya yönlendirebilirsiniz.
            const expireDate = new Date(); // Geçerlilik süresi belirlenir
            expireDate.setTime(expireDate.getTime() + (1 * 60 * 60 * 1000)); // 1 saat
            const expires = "expires=" + expireDate.toUTCString();
            document.cookie = `userName=${userName};${expires};path=/`;
            window.location.href = '/Home/Message';
        },
        error: function (errorData) {
            // İşlem hatalı olduğunda yapılacak işlemleri burada tanımlayabilirsiniz.
            alert('Login işlemi başarısız oldu. Lütfen kullanıcı adı ve şifrenizi kontrol edin.');
        }
    });
}