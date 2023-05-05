document.getElementById("SetProfile").addEventListener("click", function (event) {
    var email = document.getElementById("email").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var dateInput = document.getElementById("birthDate");
    sendEditRequest(email, firstName, lastName, dateInput.value, phoneNumber);

    event.preventDefault();
});
//Send EditProfileRequest to Api
function sendEditRequest(email, firstName, lastName, birthDate, phoneNumber) {
    var apiUrl = 'https://localhost:7212/api/User/setprofile'; // WebApi adresi

    // Kullanıcı adı ve şifre bilgilerini JSON formatına dönüştürün
    var requestData = { userName: userName, email: email, firstName: firstName, lastName: lastName, birthDate: birthDate, phoneNumber: phoneNumber };
    var jsonData = JSON.stringify(requestData);

    // HTTP GET isteği oluşturun ve isteği gönderin
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

var tarihParcalari = tarih.split(".");

// Daha sonra parçaları sırasıyla gün, ay ve yıl olarak alarak yeni bir Date nesnesi oluşturabiliriz
var gun = tarihParcalari[0];
var ay = tarihParcalari[1] - 1; // JavaScript'te aylar 0-11 arasında numaralandırılır, bu yüzden 1 çıkarıyoruz
var yil = tarihParcalari[2];

var date = new Date(yil, ay, gun);
var yyyy = date.getFullYear().toString();
var MM = (date.getMonth() + 1).toString().padStart(2, "0");
var dd = date.getDate().toString().padStart(2, "0");
var formattedDate = yyyy + "-" + MM + "-" + dd;
document.getElementById("birthDate").value = formattedDate;