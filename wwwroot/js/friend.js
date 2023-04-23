"use strict";
var joinedUser = "emir1";
var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7212/FriendHub").withAutomaticReconnect().build();
//Log In in start
connection.start().then(function () {

   connection.invoke("GetUserName",joinedUser).catch(function (err) {
        return console.error(err.toString());
    });
   
}).catch(function (err) {
    return console.error(err.toString());
}); 
//All Users
connection.on("Users", function (usersList,friendsList) {
    const userList = document.getElementById("Users");
    userList.innerHTML = "";
    usersList.forEach(function (user) {
        const listItem = document.createElement("tr");
        listItem.classList.add("candidates-list");
            var str = `
                                <td class="title">
                                    <div class="thumb">
                                        <img class="img-fluid" src="${user.imageUrl}">
                                    </div>
                                    <div class="candidate-list-details">
                                        <div class="candidate-list-info">
                                            <div class="candidate-list-title">
                                                <h5 class="mb-0"><a href="/${user.userName}">${user.userName}</a></h5>
                                            </div>
                                            <div class="candidate-list-option">
                                                <ul class="list-unstyled">
                                                    <li><i class="fas fa-filter pr-1"></i>${user.firstName} ${user.lastName}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="candidate-list-favourite-time text-center">
                                  <i class="fa fa-circle online"></i>
                                    <span class="candidate-list-time order-1">Online</span>
                                </td>
                                <td>
                                        <button class="btn btn-primary" id="add-friend">Add Friend</button>
                                </td>
                            `
        
        listItem.innerHTML = str;
        userList.appendChild(listItem);
    });
});

//User filter
// search inputunu ve ul etiketini yakala
const searchInput = document.getElementById('searchInput');
const _userList = document.getElementById('users');

// search inputunda herhangi bir değer değiştiğinde çalışacak fonksiyonu tanımla
searchInput.addEventListener('input', function (event) {
    // girilen değeri al
    const searchText = event.target.value.toLowerCase();
    // li elementlerini al
    const users = _userList.getElementsByTagName('li');

    // her bir li elementinin içindeki userName div elementini kontrol et
    for (let i = 0; i < users.length; i++) {
        const userName = users[i].querySelector('#userName');
        const nameValue = userName.textContent.toLowerCase();

        // girilen değer ile userName içindeki text karşılaştır
        if (nameValue.includes(searchText)) {
            // eşleşme varsa li elementini görünür yap
            users[i].style.display = 'block';
        } else {
            // eşleşme yoksa li elementini gizle
            users[i].style.display = 'none';
        }
    }
});
