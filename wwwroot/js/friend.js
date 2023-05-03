"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7212/ChatHub").withAutomaticReconnect().build();
//Log In in start
connection.start().then(function () {

    connection.invoke("GetUserList", joinedUser).catch(function (err) {
        return console.error(err.toString());
    });

}).catch(function (err) {
    return console.error(err.toString());
});
//All Users
connection.on("Users", function (usersList, friendsList, friendRequest) {
    const userList = document.getElementById("Users");
    userList.innerHTML = "";
    for (var i = 0; i < friendsList.length; i++) {
        for (var j = 0; j < usersList.length; j++) {
            if (friendsList[i].userName == usersList[j].userName) {
                const listItem = document.createElement("tr");
                listItem.classList.add("candidates-list");
                var str = `                            
                             <td class="title">
                                 <div class="thumb">
                                     <img class="img-fluid " src="${usersList[j].imageUrl}">
                                 </div>
                                 <div class="candidate-list-details">
                                     <div class="candidate-list-info">
                                         <div class="candidate-list-title">
                                             <h5 class="mb-0" id="userName"><a href="/${usersList[j].userName}">${usersList[j].userName}</a></h5>
                                         </div>
                                         <div class="candidate-list-option">
                                             <ul class="list-unstyled">
                                                 <li><i class="fas fa-filter pr-1"></i>${usersList[j].firstName} ${usersList[j].lastName}</li>
                                             </ul>
                                         </div>
                                     </div>
                                 </div>
                             </td>
                             <td id="button">
                                     <button class="btn btn-danger" onclick=removeFriend(this) id="remove-friend">Arkadaşlıktan Çıkar</button>
                             </td>                             
                        `
                listItem.innerHTML = str;
                userList.appendChild(listItem);
                usersList.splice(j, 1);
            }
        }
    }
    for (var i = 0; i < friendRequest.length; i++) {
        for (var j = 0; j < usersList.length; j++) {
            if (friendRequest[i].sender.userName == joinedUser && friendRequest[i].reciever.userName == usersList[j].userName) {
                const listItem = document.createElement("tr");
                listItem.classList.add("candidates-list");
                var str = `                            
                             <td class="title">
                                 <div class="thumb">
                                     <img class="img-fluid" src="${usersList[j].imageUrl}">
                                 </div>
                                 <div class="candidate-list-details">
                                     <div class="candidate-list-info">
                                         <div class="candidate-list-title">
                                             <h5 class="mb-0" id="userName"><a href="/${usersList[j].userName}">${usersList[j].userName}</a></h5>
                                         </div>
                                         <div class="candidate-list-option">
                                             <ul class="list-unstyled">
                                                 <li><i class="fas fa-filter pr-1"></i>${usersList[j].firstName} ${usersList[j].lastName}</li>
                                             </ul>
                                         </div>
                                     </div>
                                 </div>
                             </td>
                             <td id="button">
                                     <button class="btn btn-secondary" onclick="removeRequest(this)" id="remove-request">İsteği Kaldır</button>
                             </td>                             
                        `
                listItem.innerHTML = str;
                userList.appendChild(listItem);
                usersList.splice(j, 1);
            }
            else if (friendRequest[i].sender.userName == usersList[j].userName && friendRequest[i].reciever.userName == joinedUser) {
                const listItem = document.createElement("tr");
                listItem.classList.add("candidates-list");
                var str = `                            
                             <td class="title">
                                 <div class="thumb">
                                     <img class="img-fluid" src="${usersList[j].imageUrl}">
                                 </div>
                                 <div class="candidate-list-details">
                                     <div class="candidate-list-info">
                                         <div class="candidate-list-title">
                                             <h5 class="mb-0" id="userName"><a href="/${usersList[j].userName}">${usersList[j].userName}</a></h5>
                                         </div>
                                         <div class="candidate-list-option">
                                             <ul class="list-unstyled">
                                                 <li><i class="fas fa-filter pr-1"></i>${usersList[j].firstName} ${usersList[j].lastName}</li>
                                             </ul>
                                         </div>
                                     </div>
                                 </div>
                             </td>
                             <td id="button">
                                    <button class="btn btn-dark" onclick="accept(this)" id="accept-friend">Kabul Et</button>
                             </td>                             
                        `
                listItem.innerHTML = str;
                userList.appendChild(listItem);
                usersList.splice(j, 1);
            }
        }
    }
    usersList.forEach(function (user) {
        const listItem = document.createElement("tr");
        if (user.userName == joinedUser) {

        }
        else {
            listItem.classList.add("candidates-list");
            var str = `
                            
                             <td class="title">
                                 <div class="thumb">
                                     <img class="img-fluid" src="${user.imageUrl}">
                                 </div>
                                 <div class="candidate-list-details">
                                     <div class="candidate-list-info">
                                         <div class="candidate-list-title">
                                             <h5 class="mb-0" id="userName"><a href="/${user.userName}">${user.userName}</a></h5>
                                         </div>
                                         <div class="candidate-list-option">
                                             <ul class="list-unstyled">
                                                 <li><i class="fas fa-filter pr-1"></i>${user.firstName} ${user.lastName}</li>
                                             </ul>
                                         </div>
                                     </div>
                                 </div>
                             </td>
                             <td id="button">
                                     <button class="btn btn-primary" onclick="addFriend(this)" id="add-friend">Arkadaş Ekle</button>
                             </td>
                             
                        `
            listItem.innerHTML = str;
            userList.appendChild(listItem);
        }
    });
});
function addFriend(button) {
    var div = button.parentNode;
    var divv = div.parentNode;
    div.innerHTML = "";
    var str = `<button class="btn btn-secondary" onclick="removeRequest(this)" id="remove-request">İsteği Kaldır</button>`;
    div.innerHTML = str;
    button.innerHTML = "";

    const userNameElement = divv.querySelector('#userName');
    const targetUser = userNameElement.textContent;
    console.log(targetUser);
    connection.invoke("AddFriend", joinedUser, targetUser).catch(function (err) {
        return console.error(err.toString());
    });
}
function removeRequest(button) {
    var div = button.parentNode;
    var divv = div.parentNode;
    div.innerHTML = "";
    var str = `<button class="btn btn-primary" onclick="addFriend(this)" id="add-friend">Arkadaş Ekle</button>`;
    div.innerHTML = str;
    button.innerHTML = "";
    const userNameElement = divv.querySelector('#userName');
    const targetUser = userNameElement.textContent;
    console.log(targetUser);
    connection.invoke("RemoveRequest", joinedUser, targetUser).catch(function (err) {
        return console.error(err.toString());
    });
}
function accept(button) {
    var div = button.parentNode;
    var divv = div.parentNode;
    div.innerHTML = "";
    var str = `<button class="btn btn-danger" onclick=removeFriend(this) id="remove-friend">Arkadaşlıktan Çıkar</button>`;
    div.innerHTML = str;
    button.innerHTML = "";
    const userNameElement = divv.querySelector('#userName');
    const targetUser = userNameElement.textContent;
    console.log(targetUser);
    connection.invoke("AcceptFriend", targetUser, joinedUser).catch(function (err) {
        return console.error(err.toString());
    });
}
function removeFriend(button) {
    var div = button.parentNode;
    var divv = div.parentNode;
    div.innerHTML = "";
    var str = `<button class="btn btn-primary" onclick="addFriend(this)" id="add-friend">Arkadaş Ekle</button>`;
    div.innerHTML = str;
    button.innerHTML = "";
    const userNameElement = divv.querySelector('#userName');
    const targetUser = userNameElement.textContent;
    console.log(targetUser);
    connection.invoke("RemoveFriend", joinedUser, targetUser).catch(function (err) {
        return console.error(err.toString());
    });
}
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
connection.on("AcceptFriend", function (userName) {
    const _userList = document.getElementById("Users");
    const users = _userList.getElementsByTagName('tr');

    // her bir li elementinin içindeki userName div elementini kontrol et
    for (let i = 0; i < users.length; i++) {
        const _userName = users[i].querySelector('#userName').textContent;
        if (_userName.trim() == userName.trim()) {
            var button = users[i].querySelector('#button');
            button.innerHTML = "";
            var str = '<button class="btn btn-danger" onclick=removeFriend(this) id="remove-friend">Arkadaşlıktan Çıkar</button>';
            button.innerHTML = str;
        }
    }
});
connection.on("AcceptButton", function (userName) {
    const _userList = document.getElementById("Users");
    const users = _userList.getElementsByTagName('tr');

    // her bir li elementinin içindeki userName div elementini kontrol et
    for (let i = 0; i < users.length; i++) {
        const _userName = users[i].querySelector('#userName').textContent;
        if (_userName.trim() == userName.trim()) {
            var button = users[i].querySelector('#button');
            button.innerHTML = "";
            var str = '<button class="btn btn-dark" onclick="accept(this)" id="accept-friend">Kabul Et</button>';
            button.innerHTML = str;
        }
    }
});
connection.on("RemoveRequest", function (userName) {
    const _userList = document.getElementById("Users");
    const users = _userList.getElementsByTagName('tr');

    // her bir li elementinin içindeki userName div elementini kontrol et
    for (let i = 0; i < users.length; i++) {
        const _userName = users[i].querySelector('#userName').textContent;
        if (_userName.trim() == userName.trim()) {
            var button = users[i].querySelector('#button');
            button.innerHTML = "";
            var str = '<button class="btn btn-primary" onclick="addFriend(this)" id="add-friend">Arkadaş Ekle</button>';
            button.innerHTML = str;
        }
    }
});
connection.on("RemoveFriend", function (userName) {
    const _userList = document.getElementById("Users");
    const users = _userList.getElementsByTagName('tr');

    // her bir li elementinin içindeki userName div elementini kontrol et
    for (let i = 0; i < users.length; i++) {
        const _userName = users[i].querySelector('#userName').textContent;
        if (_userName.trim() == userName.trim()) {
            var button = users[i].querySelector('#button');
            button.innerHTML = "";
            var str = '<button class="btn btn-primary" onclick="addFriend(this)" id="add-friend">Arkadaş Ekle</button>';
            button.innerHTML = str;
        }
    }
});