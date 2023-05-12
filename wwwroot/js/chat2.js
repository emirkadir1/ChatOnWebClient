﻿"use strict";

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
connection.on("Users", function (usersList,notificationList) {
    const userList = document.getElementById("Users");
    userList.innerHTML = "";
    usersList.forEach(function (user) {
        const listItem = document.createElement("div");
        var notification = 0;
        for (var i = 0; i < notificationList.length; i++) {
            if (notificationList[i].sender==user.userName) {
                notification += 1;
            }
        }
        if (user.online) {
            if (notification > 0) {
                var str = `<div class="list-group-item list-group-item-action border-0" onclick="getUser(this)">
                        <div class="badge bg-success float-right" id="messageCount">${notification}</div>
                        <div class="d-flex align-items-start">
                            <img src="${user.imageUrl}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40" id="image">
                            <div class="flex-grow-1 ml-3">
                                <div id="userName">${user.userName}</div>
                                <div id="status">
                                <div class="small"><span class="fa fa-circle online"></span> Online</div>
                                </div>
                                    <div id="sideMessage">
                                    </div>
                            </div>
                        </div>
                    </div>`

            }
            else {
                var str = `<div class="list-group-item list-group-item-action border-0" onclick="getUser(this)">
                        <div class="badge bg-success float-right" id="messageCount" style="display:none;">${notification}</div>
                        <div class="d-flex align-items-start">
                            <img src="${user.imageUrl}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40" id="image">
                            <div class="flex-grow-1 ml-3">
                                <div id="userName">${user.userName}</div>
                                <div id="status">
                                <div class="small"><span class="fa fa-circle online"></span> Online</div>
                                </div>
                                    <div id="sideMessage">
                                    </div>
                            </div>
                        </div>
                    </div>`
            }
            
        }
        else {
            if (notification>0) {
                var str = `<div class="list-group-item list-group-item-action border-0" onclick="getUser(this)">
                        <div class="badge bg-success float-right" id="messageCount">${notification}</div>
                        <div class="d-flex align-items-start">
                            <img src="${user.imageUrl}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40" id="image">
                            <div class="flex-grow-1 ml-3">
                                <div id="userName">${user.userName}</div>
                                <div id="status">
                                <div class="small"><span class="fa fa-circle online"></span> Online</div>
                                </div>
                                    <div id="sideMessage">
                                    </div>
                            </div>
                        </div>
                    </div>`
            }
            else {
                var str = `<div class="list-group-item list-group-item-action border-0" onclick="getUser(this)">
                        <div class="badge bg-success float-right" id="messageCount" style="display:none;">${notification}</div>
                        <div class="d-flex align-items-start">
                            <img src="${user.imageUrl}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40" id="image">
                            <div class="flex-grow-1 ml-3">
                                <div id="userName">${user.userName}</div>
                                <div id="status">
                                <div class="small"><span class="fa fa-circle online"></span> Online</div>
                                </div>
                                    <div id="sideMessage">
                                    </div>
                            </div>
                        </div>
                    </div>`
            }
        }
        listItem.id = "User";
        listItem.innerHTML = str;
        userList.appendChild(listItem);
    });
});
//User filter
// search inputunu ve ul etiketini yakala
const searchInput = document.getElementById('searchInput');
const _userList = document.getElementById('Users');

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
    else {
        messageBox.innerHTML = "";
    }
    if (friendNotification > 0) {
        var div = document.createElement("div");
        var str = `<i class='far fa-comment-dots' style='font-size:24px;color:orangered'>${friendNotification}</i>`;
        div.innerHTML = str;
        friendBox.innerHTML = "";
        friendBox.appendChild(div);
    }
    else {
        friendBox.innerHTML = "";
    }

});
connection.on("GetNotification", function (userName) {
    for (let i = 0; i < _userList.childNodes.length; i++) {
        const _user = _userList.children[i];
        const _userName = _user.querySelector('#userName');
        // girilen değer ile userName içindeki text karşılaştır
        if (_userName.innerText.trim()==userName.trim()) {            
            var messageCount = _user.querySelector('#messageCount');
            messageCount.style.display = 'block';
            var count = messageCount.innerText;
            var number = parseInt(count);
            number += 1;
            messageCount.innerText = number;

        }
    }
});
connection.on("DeleteNotification", function (userName) {
    for (let i = 0; i < _userList.childNodes.length; i++) {
        const _user = _userList.children[i];
        const _userName = _user.querySelector('#userName');
        // girilen değer ile userName içindeki text karşılaştır
        if (_userName.innerText.trim() == userName.trim()) {
            var messageCount = _user.querySelector('#messageCount');
            messageCount.style.display = 'none';
            messageCount.innerText = '0';
            break;
        }
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
                                <div style="margin-block-start:auto;">
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
                               <div style="margin-block-start:auto;">
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
                                <div style="margin-block-start:auto;">
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:blue'></i>
                                </div>
                            </div>`;
    }
    document.getElementById("messagesList").appendChild(div);
    div.innerHTML = str;
    let element = document.getElementById("messagesList");
    let scrollHeight = element.scrollHeight;
    element.scrollTop = scrollHeight;
    var notificationSound = document.getElementById("notificationSound");
    notificationSound.play();   
    for (let i = 0; i < _userList.childNodes.length; i++)
    {
            const _user = _userList.children[i];
            const userName = _user.querySelector('#userName');
            var sideMessageDiv = _user.querySelector('#sideMessage');
            // girilen değer ile userName içindeki text karşılaştır
            if (userName.textContent==targetUser) {
                if (message.length < 14) {
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
        if (message.sender == joinedUser && message.reciver == targetUser.trim()) {
            var listItem = document.createElement("div");
            if (message.isRecived == 0) {
                var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${message.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">

                                    <div class="font-weight-bold mb-1"><b>You</b></div>${message.body} \n ${message.translate}</div>
                               <div style="margin-block-start:auto;">
                                    <i class='fas fa-angle-left' style='font-size:20px;color:lightslategrey'></i>
                                </div>
                            </div>`;
            }
            else if (message.isRecived == 1) {
                var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${message.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1"><b>You</b></div>${message.body} \n ${message.translate}</div>
                                <div style="margin-block-start:auto;">
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:lightslategrey'></i>
                                </div>
                            </div>`;
            }
            else {
                var str = `<div class="chat-message-right pb-4">
                                <div>
                                    <img src="${message.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1"><b>You</b></div>${message.body} \n ${message.translate}</div>
                               <div style="margin-block-start:auto;">
                                    <i class='fas fa-angle-double-left' style='font-size:20px;color:blue'></i>
                                </div>
                            </div>`;
            }
            listItem.innerHTML = str;
            document.getElementById("messagesList").appendChild(listItem);
        }
        if (message.sender == targetUser.trim() && message.reciver == joinedUser) {
            var listItem = document.createElement("div");
            var str = `<div class="chat-message-left pb-4">
                                <div>
                                    <img src="${message.imageUrl}" class="rounded-circle mr-1" width="40" height="40">
                                    <div class="text-muted small text-nowrap mt-2">${message.createdTime}</div>
                                </div>
                                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style="width:300px;overflow:auto">
                                    <div class="font-weight-bold mb-1"><b>${message.sender}</b></div>${message.body} \n ${message.translate}</div>
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
    let element = document.getElementById("messagesList");
    let scrollHeight = element.scrollHeight;
    element.scrollTop = scrollHeight;
});
//Is message get translated?
var translate = false;
// Send Message
document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", joinedUser, targetUser,message,translate).catch(function (err) {
            return console.error(err.toString());
        });
    event.preventDefault();
});

function translateMode(_switch) {
    if (translate) {
        translate = false;
    }
    else {
        translate = true;
    }
    console.log(translate);
}   
//Current User
function getUser(user) {

    targetUser = user.querySelector("div#userName").innerHTML;
    var header = `<div class="position-relative">
                                <img src="${user.querySelector("img#image").src}" class="rounded-circle mr-1" width="40" height="40">
                            </div>
                            <div class="flex-grow-1 pl-3">
                                <strong><a href="/${user.querySelector("div#userName").innerHTML}"> ${user.querySelector("div#userName").innerHTML}</a></strong>
                                
                            </div>
                             <button class="btn btn-success border btn-lg px-3"><i class="fa fa-bell" aria-hidden="true"></i></button>
                             <button class="btn btn-warning border btn-lg px-3"><i class="fa fa-bell-slash" aria-hidden="true"></i></button>
                             <button class="btn btn-danger border btn-lg px-3"><i class="fa fa-user-times" aria-hidden="true"></i></button>
                            <div class="dropdown">                                
                                <button class="btn btn-light border btn-lg px-4"  type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal feather-lg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
    </button><ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownMenuButton">

    <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" onclick="translateMode(this)" id="translateSwitch">
    <label class="form-check-label" for="flexSwitchCheckDefault">Çeviri Modu</label>
    </div>
    </ul>
</div>
                            </div>`;
                            /* <a class="dropdown-item" href="#"><span class="flag-icon flag-icon-tr flag-icon-squared"></span>  TR</a>
    <a class="dropdown-item" href="#"><span class="flag-icon flag-icon-gb flag-icon-squared"></span>  EN</a>
    <a class="dropdown-item" href="#"><span class="flag-icon flag-icon-de flag-icon-squared"></span>  DE</a>
    <a class="dropdown-item" href="#"><span class="flag-icon flag-icon-fr flag-icon-squared"></span>  FR</a>*/ 
    // burada istediğiniz şekilde image url stringini kullanabilirsiniz
    document.getElementById("userHeader").innerHTML = header;
    if (joinedUser != '' && targetUser != '') {
        connection.invoke("GetMessages", joinedUser, targetUser).catch(function (err) {
            return console.error(err.toString());
        });
        connection.invoke("DeleteMessageNotification", joinedUser, targetUser).catch(function (err) {
            return console.error(err.toString());
        });
    }
}
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

