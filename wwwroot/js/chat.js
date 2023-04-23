"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7212/ChatHub").withAutomaticReconnect().build();
var targetUser = "";
//Log In in start
connection.start().then(function () {

   connection.invoke("GetUserName").catch(function (err) {
        return console.error(err.toString());
    });
   
}).catch(function (err) {
    return console.error(err.toString());
}); 
//All Users
connection.on("Users", function (usersList) {
    const userList = document.getElementById("users");
    userList.innerHTML = "";
    usersList.forEach(function (user) {
        const listItem = document.createElement("li");
        if (user.online) {
            var str = `<li class="clearfix" id="user" onclick="getUser(this)"><img src="${user.imageUrl}" alt="avatar"><div class="about"><div class="name" id="userName"> ${user.userName}</div><div class="row p-1"></div><div class="status"> <i class="fa fa-circle online"></i></div><div id="sideMessage"></div></div></li> `
        }
        else {
            var str = `<li class="clearfix" id="user" onclick="getUser(this)"><img src="${user.imageUrl}" alt="avatar"><div class="about"><div class="name" id="userName"> ${user.userName}</div><div class="row p-1"></div><div class="status"> <i class="fa fa-circle offline"></i></div><div id="sideMessage"></div></div></li> `
        }

        listItem.innerHTML = str;
        userList.appendChild(listItem);
    });
});
connection.on("ReceiveMessageMine", function (user, message, time) {
    var li = document.createElement("li");
    var str = `<li class="clearfix"><div class="message-data text-right"style="margin-left: 760px;"><span class="message-data-time">${time} ${user.userName}</span></div> <div class="message other-message float-right"> \n ${message} </div></li>`;
    document.getElementById("messagesList").appendChild(li);
    li.innerHTML = str;
    var notificationSound = document.getElementById("notificationSound");
    notificationSound.play();
    // Tüm li elementleri seç
    var liElements = document.querySelectorAll("li#user");

    // li elementlerini döngüyle gez
    for (var i = 0; i < liElements.length; i++) {
        // Seçilen li elementindeki userName div'ini seç
        var userNameDiv = liElements[i].querySelector("div#userName");

        // Seçilen kullanıcının userName etiketiyle eşleşiyorsa
        if (userNameDiv.textContent === targetUser) {
            // Li elementinin sideMessage div'inin textcontent'ini değiştir
            var sideMessageDiv = liElements[i].querySelector("div#sideMessage");
            if (message.length < 14)
            {
                sideMessageDiv.textContent = '\n ' + message.substring(0, 12);
            }
            else {
                sideMessageDiv.textContent = '\n ' + message.substring(0, 12) + '...';
            }
            
        }
    }

});

connection.on("ReceiveMessageFromOthers", function (user, message, time) {
    
    const _userName = user.userName
    if (_userName.trim() === targetUser.trim()) {
        var li = document.createElement("li");
        var str = `<li class="clearfix"><div class="message-data"><span class="message-data-time">${time} ${user.userName}</span></div><div class="message my-message"> \n ${message}</div></li>`;
        document.getElementById("messagesList").appendChild(li);
        li.innerHTML = str;
        var notificationSound = document.getElementById("notificationSound");
        notificationSound.play();
    }
    var liElements = document.querySelectorAll("li#user");
    // li elementlerini döngüyle gez
    for (var i = 0; i < liElements.length; i++) {
        // Seçilen li elementindeki userName div'ini seç
        var userNameDiv = liElements[i].querySelector("div#userName");
        // Seçilen kullanıcının userName etiketiyle eşleşiyorsa
        if (userNameDiv.textContent.trim() === _userName.trim()) {
            // Li elementinin sideMessage div'inin textcontent'ini değiştir
            var sideMessageDiv = liElements[i].querySelector("div#sideMessage");
            if (message.length < 14) {
                sideMessageDiv.textContent = '\n ' + message.substring(0, 12);
            }
            else {
                sideMessageDiv.textContent = '\n ' + message.substring(0, 12) + '...';
            }
         
        }
    }
});


// ShowMessages
connection.on("ShowMessages", function (messages) {
    document.getElementById("messagesList").innerHTML = "";
    messages.forEach(function (message) {
        if (message.sender.userName == joinedUser && message.reciver.userName == targetUser.trim()) {
            var listItem = document.createElement("li");
            var str =`<li class="clearfix"><div class="message-data text-right"style="margin-left: 760px;"><span class="message-data-time ">${message.createdTime} ${message.sender.userName}</span> </div> <div class="message other-message float-right"> \n ${message.body} </div></li>`;
            listItem.innerHTML = str;
            document.getElementById("messagesList").appendChild(listItem);
        }
        if (message.sender.userName == targetUser.trim() && message.reciver.userName == joinedUser) {
            var listItem = document.createElement("li");
            var str = `<li class="clearfix"><div class="message-data"><span class="message-data-time">${message.createdTime} ${message.sender.userName}</span></div><div class="message my-message">${message.body}</div></li>`;
            listItem.innerHTML = str;
            document.getElementById("messagesList").appendChild(listItem);
        }
    });
    
});

// Send Message
document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", joinedUser, targetUser,message).catch(function (err) {
            return console.error(err.toString());
        });
    event.preventDefault();
});

//Current User
function getUser(user) {
    var _user = user // tıklanan resmin image url'sini al
    targetUser = user.querySelector("div#userName").innerHTML;
    //var header = `<div class="col-lg-6" id="userHeader"> <h6 class="m-b-0">${targetUser}</h6><small>Last seen: 2 hours ago</small></div>`;
    // burada istediğiniz şekilde image url stringini kullanabilirsiniz
    document.getElementById("userHeader").innerHTML = _user.innerHTML;
    if (joinedUser != '' && targetUser != '') {
        connection.invoke("GetMessages", joinedUser, targetUser).catch(function (err) {
            return console.error(err.toString());
        });
    }
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
