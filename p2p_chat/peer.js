var topology = require('fully-connected-topology');

// get peers from args
var me = process.argv[2];
var peers = process.argv.slice(3);

var swarm = topology(me, peers);

swarm.on('connection', (connection, peer) => {
  console.log('new connection from ', peer);
});
