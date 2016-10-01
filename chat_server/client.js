
const net = require('net');
const jsonStream = require('duplex-json-stream');

// get username from arg
var user_name = process.argv.slice(2).toString();
console.log(user_name);

// var client = net.createConnection({port: 8001}, () => {
//   //'connect' listener
//   console.log('connected to server!');
// });

var client = jsonStream(net.connect(8001));

// client = jsonStream(client);

process.stdin.on('data', (data) => {
  var message = data.toString().trim();
  client.write({
    username : user_name,
    message : message
  });
});

client.on('data', (data) => {
  console.log(data);
  // process.stdout.write(data);
});
