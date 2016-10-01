
const net = require('net');
const jsonStream = require('duplex-json-stream');
require('lookup-multicast-dns/global');

// get username from arg
var user_name = process.argv.slice(2).toString();
console.log(user_name);

// var client = net.createConnection({port: 8001}, () => {
//   //'connect' listener
//   console.log('connected to server!');
// });

// get server name for multicast dns
var host_name = process.argv[3].toString();

// connect to host
var client = jsonStream(net.connect(8001, host_name));

// send input to server
process.stdin.on('data', (data) => {
  var message = data.toString().trim();
  client.write({
    username : user_name,
    message : message
  });
});

// retreive data -> print out message
client.on('data', (data) => {
  console.log(data.username + '> ' + data.message);
  // process.stdout.write(data);
});
