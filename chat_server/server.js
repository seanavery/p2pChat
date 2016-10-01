const net = require('net');
const jsonStream = require('duplex-json-stream');
const register = require('register-multicast-dns');

// get server nickname from args
var server_nickname = process.argv[2].toString().trim();
// register nicname
register(server_nickname + '.local');
console.log('server registered as ' + server_nickname + '.local');

// list of all clients connected to server
let clientList = [];

// create server connrvyion
const server = net.createServer((socket) => {

  socket = jsonStream(socket);

  console.log('server connected');

  // dfine socket name
  socket.name = socket.remoteAddress + ":" + socket.remotePort; // + Math.random().toString();
  console.log("welcome: " + socket.name);

  // add to client list
  clientList.push(socket);

  socket.on('data', (data) => {
    console.log('data is: ' + data);
    sendMessage(data, socket)
  });
});

// helper function to send message to clients
function sendMessage(data, sender_socket) {
  clientList.forEach((client) => {
    // send to all clients but sender
    if(client == sender_socket) {
      console.log('do not reply to sender: ' + client.name);
    }
    else {
      client.write(data);
    }

  });
}

// server listen in on port 8001
server.listen(8001, () => {
  console.log('server listening on port 8001');
});
