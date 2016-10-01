const net = require('net');
let clientList = [];
const server = net.createServer((socket) => {
  console.log('server connected');
  socket.name = socket.remoteAddress + ":" + socket.remotePort; // + Math.random().toString();
  console.log("welcome: " + socket.name);
  clientList.push(socket);

  socket.on('data', (data) => {
    sendMessage(data, socket)
  });
});

function sendMessage(data, sender_socket) {
  clientList.forEach((client) => {
    // send to all clients but sender
    if(client == sender_socket) {
      console.log('do not reply to sender');
    }
    else {
      client.write(data);
    }

  });
}

server.listen(8001, () => {
  console.log('server listening on port 8001');
});
