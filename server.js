const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// app.use(cors());

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

io.on("connection", socket => {
  console.log(`Socket Conectado: ${socket.id}`);

  socket.on("PLAYER_SUBMIT", data => {
    messages.push(data);

    socket.emit("PLAYER_SUBMIT_RESPONSE", messages);
  });

});

// server.listen(process.env.PORT || 3000);
// server.listen(3000);
server.listen(process.env.PORT || 3000);