// import libraries
var net = require('net');
var topology = require('fully-connected-topology');
var streamSet = require('stream-set');

// get username from args
var user_name = process.argv[2];

// get peers from args
var me = process.argv[3];
var peers = process.argv.slice(4);

// set up list of sockets
var activeSockets = streamSet();

var swarm = topology(me, peers);

swarm.on('connection', (connection, peer) => {
  activeSockets.add(connection);
  console.log('made it here');
  console.log('new connection from ', peer);
  console.log(activeSockets.size);
});
