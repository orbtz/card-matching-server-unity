const express = require("express");
const app = express();

const server = require("http").createServer(app);
const WebSocket = require('ws');

const path = require("path");
const cors = require("cors");
app.use(cors());

const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let leaderboard = []; //Dummie data

wss.on('connection', function(ws){

  ws.on('message', function (data) {

    // data = JSON.parse(data);
    console.log(data);

    var player = JSON.stringify({
      name: "Fábio",
      points: 5
    });

    leaderboard.push(player);

    ws.send(JSON.stringify({
      info: "Recebido pelo Server!",
      players: leaderboard
    }));
  });

  ws.on('close', function(){
    //TODO
  });
});


server.listen(process.env.PORT || 3000, function(){
  console.log('Server na Porta 3000');
});