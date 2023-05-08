"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7212/ChatHub").withAutomaticReconnect().build();
//Log In in start
connection.start().then(function () {

    connection.invoke("GetNotifications",joinedUser).catch(function (err) {
        return console.error(err.toString());
    });

}).catch(function (err) {
    return console.error(err.toString());
});
connection.on("Notification", function (notificationList) {
    console.log("oldu");
    const messageBox = document.getElementById("messageBox");
    const friendBox = document.getElementById("friendBox");
    var messageNotification = 0;
    var friendNotification = 0;
    notificationList.forEach(function (user) {
        if (user.type =="message") {
            messageNotification += 1;
        }
        else if(user.type="friend"){
            friendNotification += 1;
        }
    });
    if (messageNotification > 0) {
        var div = document.createElement("div");
        var str = `<i class='far fa-comment-dots' style='font-size:24px;color:orangered'>${messageNotification}</i>`;
        div.innerHTML = str;
        messageBox.appendChild(div);
    }
    if (friendNotification > 0) {
        var div = document.createElement("div");
        var str = `<i class='far fa-comment-dots' style='font-size:24px;color:orangered'>${friendNotification}</i>`;
        div.innerHTML = str;
        friendBox.appendChild(div);
    }
});