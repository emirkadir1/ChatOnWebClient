function getImgUrl(img) {

    imgUrl = img.getAttribute('src'); // tıklanan resmin image url'sini al
    document.getElementById('sideImage').src = imgUrl;
    console.log("Resim URL'si: " + imgUrl);
    // burada istediğiniz şekilde image url stringini kullanabilirsiniz
}
document.getElementById("SetProfile").addEventListener("click", function (event) {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var dateInput = document.getElementById("birthDate");
    var language = document.getElementById("language").value;
    sendEditRequest(firstName, lastName, dateInput.value, phoneNumber,language);

    event.preventDefault();
});
//Send EditProfileRequest to Api
function sendEditRequest(firstName, lastName, birthDate, phoneNumber,language) {
    var apiUrl = 'https://localhost:7212/api/User/firsttime'; // WebApi adresi

    // Kullanıcı adı ve şifre bilgilerini JSON formatına dönüştürün
    var requestData = { userName: UserName, firstName: firstName, lastName: lastName, imageUrl: imgUrl, birthDate: birthDate, phoneNumber: phoneNumber, languageCode:language };
    var jsonData = JSON.stringify(requestData);

    // HTTP POST isteği oluşturun ve isteği gönderin
    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: jsonData,
        success: function (responseData) {

            window.location.href = `/Home/EditProfile`;
        },
        error: function (errorData) {
            // İşlem hatalı olduğunda yapılacak işlemleri burada tanımlayabilirsiniz.
            alert('Edit Profile işlemi  oldu. Lütfen kullanıcı adı ve şifrenizi kontrol edin.' + errorData);
        }
    });
}