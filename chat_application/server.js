const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

// Socket.io Setup

const io = require("socket.io")(server);
var users = {};
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("new-user-joined", (username) => {
    users[socket.id] = username;
    // console.log(users);
    socket.broadcast.emit("user-connected", username);
    // console.log(username);
    io.emit("user-list", users);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", (user = users[socket.id]));
    delete users[socket.id];
    io.emit("user-list", users);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("message", {
      user: data.user,
      message: data.message,
    });
  });
});

// Socket.io Setup Ends

server.listen(port, () => {
  console.log("Server started at ", port);
});
