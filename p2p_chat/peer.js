// import libraries
var net = require('net');
var topology = require('fully-connected-topology');
var streamSet = require('stream-set');
var jsonStream = require('duplex-json-stream');
var hashToPort = require('hash-to-port');
var register = require('register-multicast-dns');
require('lookup-multicast-dns');

// get username from args
var user_name = process.argv[2].toString().trim();

// register dns
var my_domain = generate_dns(user_name);

// get peers from args
var peer_list = process.argv.slice(3);

// helper function to generate unique dns name
function generate_dns(peer) {
  return peer + '.local:' + hashToPort(peer);
}

// set up list of sockets
var activeSockets = streamSet();

// set seq and id
var seq = 0
var id = Math.random()

// add cache of recieved
var recieved = {}

// setup topology
var swarm = topology(generate_dns(user_name), peer_list.map(generate_dns));
register(user_name);

  swarm.on('connection', (connection, peer) => {
  connection = jsonStream(connection);
  activeSockets.add(connection);
  console.log('new connection from ', peer);
  connection.on('data', (data) => {
    if (data.sequence == recieved[data.from]) {
      console.log('already recieieved message: ' + data.sequence);
      return;
    }
    // log.append(data.message);
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
