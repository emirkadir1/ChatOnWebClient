"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7212/ChatHub").withAutomaticReconnect().build();
//Log In in start
connection.start().then(function () {

    connection.invoke("GetUsersFriendList", joinedUser).catch(function (err) {
        return console.error(err.toString());
    });

}).catch(function (err) {
    return console.error(err.toString());
});
connection.on("FriendList", function (friendList) {
    const userList = document.getElementById("Users");
    friendList.forEach(function (user) {
        const listItem = document.createElement("div");
        if (user.userName == joinedUser) {

        }
        else {
            listItem.classList.add("list-group-item");
            listItem.classList.add("d-flex");
            listItem.classList.add("align-items-center");
            var str = `
                       <img src="${user.imageUrl}" alt="" width="50px" class="rounded-sm ml-n2" />
                                        <div class="flex-fill pl-3 pr-3">
                                            <div><a href="/${user.userName}" class="text-dark font-weight-600">${user.userName}</a></div>
                                            <div class="text-muted fs-13px">${user.firstName} ${user.lastName}</div>
                                        </div>
                                        <a href="#" class="btn btn-outline-primary">Follow</a>
                        `
            listItem.innerHTML = str;
            userList.appendChild(listItem);
        }
    });
});