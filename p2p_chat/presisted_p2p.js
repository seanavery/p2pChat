var topology = require('fully-connected-topology')
var hashToPort = require('hash-to-port')
var register = require('register-multicast-dns')
require('lookup-multicast-dns')

var levelup = require('levelup');
var scuttleup = require('scuttleup')

// get me and peers form args
var me = process.argv[2].toString()
var peers = process.argv.slice(3);

// setup local level db
var db = levelup(me + '.db');
var logs = scuttleup(db, {valueEncoding: 'json'})

// register me dns
register(me)

console.log('registered local dns server at ' +  generate_dns(me))

// helper function to generat dns address
function generate_dns(name) {
  return name + '.local:' + hashToPort(name)
}

// set up swarm
var swarm = topology(generate_dns(me), peers.map(generate_dns))


// listen for connection
swarm.on('connection', function (socket, id) {
  console.log('new connection with', id)
  socket.pipe(logs.createReplicationStream({live: true})).pipe(socket)
})

// push input into level db
process.stdin.on('data', (data) => {
  logs.append({username: me, message: data.toString().trim()})
})

logs.createReadStream({live: true})
  .on('data', function (data) {
    console.log(data.entry.username + '> ' + data.entry.message)
  })
