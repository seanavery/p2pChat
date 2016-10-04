// import libraries
var net = require('net');
var topology = require('fully-connected-topology');
var streamSet = require('stream-set');
var jsonStream = require('duplex-json-stream');

// get username from args
var user_name = process.argv[2].toString().trim();

// get peers from args
var me = process.argv[3];
var peers = process.argv.slice(4);

// set up list of sockets
var activeSockets = streamSet();

// set seq and id
var seq = 0
var id = Math.random()

// add cache of recieved
var recieved = {}
// setup topology
var swarm = topology(me, peers);

swarm.on('connection', (connection, peer) => {
  connection = jsonStream(connection);
  activeSockets.add(connection);
  console.log('new connection from ', peer);
  connection.on('data', (data) => {
    if (data.sequence == recieved[data.from]) {
      console.log('already recieieved message: ' + data.sequence);
      return;
    }
    recieved[data.from] = data.sequence;
    console.log(data.username + '> ' + data.message + ' ' + data.sequence + ' ' + data.sent_from);
    seq++;
    activeSockets.forEach((socket) => {
      socket.write(data);
    });
  });
});

process.stdin.on('data', (data) =>  {
  var message = data.toString().trim();
  activeSockets.forEach((socket) => {
    socket.write({
      sent_from: id,
      sequence: seq,
      username : user_name,
      message : message,

    });
  });
  seq++;
});
