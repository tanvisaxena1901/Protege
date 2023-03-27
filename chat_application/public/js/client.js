const socket = io();
var username;
var userOnlineHTML = document.querySelector(".online-user");
var users_list = document.querySelector(".chat-list");
var message_input = document.querySelector("#message-input");
var message_send = document.querySelector("#message-send");
var message = document.querySelector(".other-message");
var message_history = document.querySelector("#message-history");

do {
  username = prompt("Enter your name");
} while (!username);

socket.emit("new-user-joined", username);
socket.on("user-connected", (socket_name) => {
  //   console.log("hello");
  userJoinLeft(socket_name, true);
});

socket.on("user-disconnected", (socket_name) => {
  userJoinLeft(socket_name, false);
});

function userJoinLeft(name, status) {
  console.log(userOnlineHTML);
  if (status) userOnlineHTML.innerText = "online";
  else userJoinLeft.innerText = "Left";
}

socket.on("user-list", (users) => {
  users_list.innerHTML = "";
  users_arr = Object.values(users);
  for (let i = 0; i < users_arr.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = `<li class="clearfix">
        <img src="./chat/avatar3.png" alt="avatar" />
        <div class="about">
          <div class="name" id="name">
            ${users_arr[i]}
          </div>
          <div class="status">
            <i class="fa fa-circle online"></i>online
          </div>
        </div>
      </li>`;
    users_list.appendChild(div);
  }
});

// Seding the messages

message_send.addEventListener("click", () => {
  let data = {
    user: username,
    message: message_input.value,
  };
  console.log(data);
  if (message_input.value != "") {
    appendMessage(data, "outgoing");
    socket.emit("message", data);
    message_input.value = "";
  }
});

function appendMessage(data, status) {
  //   let div = document.createElement("div");
  //   div.classList.add("message", status);
  //   let content = `
  //     <h5>${data.user}</h5>
  //     <p>${data.message}</p>
  //     `;
  let li1 = document.createElement("li");
  const my_message = "other-message";
  const other_message = "my-message";
  li1.classList.add("clearfix", status);
  let liMy = `
  <div class="message-data text-right">
    <span class="message-data-time">10:10 AM, Today</span>
    <img src="./chat/avatar7.png" alt="avatar" />
  </div>
  <div class="message other-message float-right">
    ${data.message}
  </div>`;
  const liOther = `
                      <div class="message-data">
                        <span class="message-data-time">10:12 AM, Today</span>
                      </div>
                      <div class="message my-message">
                        ${data.message}
                      </div>
                    </li>`;
  li1.innerHTML = status == "outgoing" ? liMy : liOther;
  message_history.appendChild(li1);
}

socket.on("message", (data) => {
  appendMessage(data, "incoming");
});
