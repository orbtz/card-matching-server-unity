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

let leaderboard = [];

//Function that will sort the leaderboard based on each Score
//0 = Best score
const sortLeaderboard = function () {
  // Getting the set length
  let length = leaderboard.length;

  // Main loop to iterate over all set elements
  for (var i = 0; i < length; i++) {
    // Min is the part that we are not going to loop again
    var min = i;
    for (var j = i + 1; j < length; j++) {
      // Executing statement comparison - If has less seconds OR has equal seconds and less moves
      if ( ( leaderboard[min].score > leaderboard[j].score ) ) {
        // Updating our current min index to iterate
        min = j;
      }
    }

    // Swaping values
    if (min !== i) {
      let temp = leaderboard[i];
      leaderboard[i] = leaderboard[min];
      leaderboard[min] = temp;
    }
  }
};

wss.on('connection', function(ws){
  console.log("CLIENT CONNECTED: " + ws);

  ws.on('message', function (message) {

    parsedData = JSON.parse(message);

    if (parsedData.type == 'LEADERBOARD_SUBMIT'){
      parsedValue = JSON.parse(parsedData.value);
      leaderboard.push(parsedValue);
      sortLeaderboard();

      console.log(leaderboard);
    }

    if (parsedData.type == 'LEADERBOARD_GET'){
      console.log("Get Leaderboard");

      ws.send(JSON.stringify({
        type: "LEADERBOARD_GET",
        value: leaderboard
      }));

      console.log(JSON.stringify({
        type: "LEADERBOARD_GET",
        value: leaderboard
      }));
    }

  });
});

server.listen(process.env.PORT || 3000, function(){
  console.log('Port: 3000');
});