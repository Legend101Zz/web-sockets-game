const http = require("http");

const app = require("express")();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.listen(8081, () => {
  console.log("express for html");
});

const { connect } = require("net");
const webSocketServer = require("websocket").server;
const httpServer = http.createServer();

const clients = {};

httpServer.listen(8080, () => {
  console.log("started server");
});

const wsServer = new webSocketServer({
  httpServer: httpServer,
});

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  connection.on("open", () => {
    console.log("opened");
  });
  connection.on("closed", () => {
    console.log("closed");
  });

  connection.on("message", (message) => {
    const result = JSON.parse(message.utf8Data);
    //I have recieved a message from the client
    console.log(result);
  });

  //generate a new clientID

  const clientId = guid();

  clients[clientId] = { connection: connection };

  const payLoad = {
    method: "connect",
    clientId: clientId,
  };
  //send back the client connect
  connection.send(JSON.stringify(payLoad));
});

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
