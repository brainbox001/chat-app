const net = require("net");
const clients = [];
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });
});

server.on("connection", (socket) => {
  const clientId = clients.length + 1;

  clients.map((client) => {
    client.socket.write(`\nUser${clientId} has joined`);
  });

  socket.write(`id-${clientId}`);
  clients.push({ id: clientId.toString(), socket });

  console.log("A new connection was made");

  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Connected to server at", server.address());
});
