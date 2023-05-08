"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7212/ChatHub").withAutomaticReconnect().build();
var targetUser = "";
//Log In in start
connection.start().then(function () {

    connection.invoke("GetUserName",joinedUser).catch(function (err) {
        return console.error(err.toString());
    });
    connection.invoke("GetNotifications", joinedUser).catch(function (err) {
        return console.error(err.toString());
    });
   
}).catch(function (err) {
    return console.error(err.toString());
}); 
//All Users
connection.on("Users", function (usersList) {
    const userList = document.getElementById("Users");
    userList.innerHTML = "";
    usersList.forEach(function (user) {
        const listItem = document.createElement("div");
        if (user.online) {
            var str = `<div class="list-group-item list-group-item-action border-0" onclick="getUser(this)">
                        <div class="badge bg-success float-right" id="messageCount">5</div>
                        <div class="d-flex align-items-start">
                            <img src="${user.imageUrl}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40" id="image">
                            <div class="flex-grow-1 ml-3">
                                <div id="userName">${user.userName}</div>
                                <div id="status">
                                <div class="small"><span class="fa fa-circle online"></span> Online</div>
                                </div>
                            </div>
                        </div>
                    </div>`
        }
        else {
            var str = `<div class="list-group-item list-group-item-action border-0" onclick="getUser(this)">
                        <div class="badge bg-success float-right" id="messageCount">5</div>
                        <div class="d-flex align-items-start">
                            <img src="${user.imageUrl}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40" id="image">
                            <div class="flex-grow-1 ml-3">
                            <div id="userName">${user.userName}</div>
                            <div id="status">
                                <div class="small"><span class="fa fa-circle offline"></span> Offline</div>
                            </div>
                            </div>
                        </div>
                    </div>`
        }
        listItem.id = "User";
        listItem.innerHTML = str;
        userList.appendChild(listItem);
    });
});
connection.on("Notification", function (notificationList) {
    console.log("oldu");
    const messageBox = document.getElementById("messageBox");
    const friendBox = document.getElementById("friendBox");
    var messageNotification = 0;
    var friendNotification = 0;
    notificationList.forEach(function (user) {
        if (user.type == "message") {
            messageNotification += 1;
        }
        else if (user.type = "friend") {
            friendNotification += 1;
        }
    });
    if (messageNotification > 0) {
        var div = document.createElement("div");
        var str = `<i class='far fa-comment-dots' style='font-size:24px;color:orangered'>${messageNotification}</i>`;
        div.innerHTML = str;
        messageBox.innerHTML = "";
        messageBox.appendChild(div);
    }
    if (friendNotification > 0) {
        var div = document.createElement("div");
        var str = `<i class='far fa-comment-dots' style='font-size:24px;color:orangered'>${friendNotification}</i>`;
        div.innerHTML = str;
        friendBox.innerHTML = "";
        friendBox.appendChild(div);
    }
});
connection.on("IAmOnline", function (user) {
    for (let i = 0; i < _userList.childElementCount; i++) {
        const _user = _userList.children[i];
        const userName = _user.querySelector('#userName');
        const nameValue = userName.textContent;
        if (user == nameValue)
        {
            _user.querySelector('#status').innerHTML = `<div class="small"><span class="fa fa-circle online"></span> Online</div>`
        } 
        
    }
});
connection.on("IAmOffline", function (user) {
    for (let i = 0; i < _userList.childElementCount; i++) {
        const _user = _userList.children[i];
        const userName = _user.querySelector('#userName');
        const nameValue = userName.textContent;
        if (user == nameValue) {
            _user.querySelector('#status').innerHTML = `<div class="small"><span class="fa fa-circle offline"></span> Offline</div>`
        }

    }
});
connection.on("ReceiveMessageMine", function (user, message, time, messageStatus,translate) {
    var div = document.createElement("div");
    if (messageStatus == 0) {
        var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${user.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${time}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message} \n ${translate}</div>
                                <div>
                                    <i class='fas fa-angle-left' style='font-size:20px;color:lightslategrey'></i>
                                </div>
                            </div>`;
    }
    else if (messageStatus == 1) {
        var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${user.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${time}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message} \n ${translate}</div>
                                <div>
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:lightslategrey'></i>
                                </div>
                            </div>`;
    }
    else {
        var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${user.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${time}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message} \n ${translate}</div>
                                <div>
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:blue'></i>
                                </div>
                            </div>`;
    }
    document.getElementById("messagesList").appendChild(div);
    div.innerHTML = str;
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

connection.on("ReceiveMessageFromOthers", function (user, message, time,translate) {
    
    const _userName = user.userName
    if (_userName.trim() === targetUser.trim()) {
        var div = document.createElement("div");
        var str = `<div class="chat-message-left pb-4" >
                                <div>
                                    <img src="${user.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${time}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message} \n ${translate}</div>
                            </div>`;
        document.getElementById("messagesList").appendChild(div);
        div.innerHTML = str;
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
            var listItem = document.createElement("div");
            if (message.isRecived == 0) {
                var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${message.sender.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message.body} \n ${message.translated}</div>
                                <div>
                                    <i class='fas fa-angle-left' style='font-size:20px;color:lightslategrey'></i>
                                </div>
                            </div>`;
            }
            else if (message.isRecived == 1) {
                var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${message.sender.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message.body} \n ${message.translated}</div>
                                <div>
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:lightslategrey'></i>
                                </div>
                            </div>`;
            }
            else {
                var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${message.sender.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">You</div>${message.body} \n ${message.translated}</div>
                                <div>
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:blue'></i>
                                </div>
                            </div>`;
            }
            listItem.innerHTML = str;
            document.getElementById("messagesList").appendChild(listItem);
        }
        if (message.sender.userName == targetUser.trim() && message.reciver.userName == joinedUser) {
            var listItem = document.createElement("div");
            var str = `<div class="chat-message-left pb-4">
                                <div>
                                    <img src="${message.sender.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1">${message.sender.userName}</div>${message.body} \n ${message.translated}</div>
                            </div >`;
            listItem.innerHTML = str;
            document.getElementById("messagesList").appendChild(listItem);
        }
    });
    if (document.getElementById("messagesList").innerText == '') {
        var div = document.createElement("div");
        var str = `<h1>Write a message to your friend!</h1>`;
        div.innerHTML = str;
        document.getElementById("messagesList").appendChild(div);
    }
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
    var header = `<div class="position-relative">
                                <img src="${user.querySelector("img#image").src}" class="rounded-circle mr-1" width="40" height="40">
                            </div>
                            <div class="flex-grow-1 pl-3">
                                <strong><a href="/${user.querySelector("div#userName").innerHTML}"> ${user.querySelector("div#userName").innerHTML}</a></strong>
                                
                            </div>
                            <div>                                
                                <button class="btn btn-light border btn-lg px-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal feather-lg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
                            </div>`;
    // burada istediğiniz şekilde image url stringini kullanabilirsiniz
    document.getElementById("userHeader").innerHTML = header;
    if (joinedUser != '' && targetUser != '') {
        connection.invoke("GetMessages", joinedUser, targetUser).catch(function (err) {
            return console.error(err.toString());
        });
    }
}

//User filter
// search inputunu ve ul etiketini yakala
const searchInput = document.getElementById('searchInput');
const _userList = document.getElementById('Users');

// search inputunda herhangi bir değer değiştiğinde çalışacak fonksiyonu tanımla
searchInput.addEventListener('input', function (event) {
    // girilen değeri al
    const searchText = event.target.value.toLowerCase();
    for (let i = 0; i < _userList.childNodes.length; i++)
    {
        const _user = _userList.children[i];
        const userName = _user.querySelector('#userName');
        const nameValue = userName.textContent.toLowerCase();

        // girilen değer ile userName içindeki text karşılaştır
        if (nameValue.includes(searchText)) {
            // eşleşme varsa li elementini görünür yap
            _user.style.display = 'block';
        } else {
            // eşleşme yoksa li elementini gizle
            _user.style.display = 'none';
        }
     }
});
if (document.getElementById("userHeader").innerHTML == '\n\n                        ') {
    var div = document.createElement("div");
    var str = `<h1>Click your friends to start chat!</h1>`;
    div.innerHTML = str;
    document.getElementById("messagesList").appendChild(div);
}

