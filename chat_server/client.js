
const net = require('net');
const client = net.createConnection({port: 8001}, () => {
  //'connect' listener
  console.log('connected to server!');
});

process.stdin.on('data', (data)=> {
  client.write(data);
});

client.on('data', (data) => {
  process.stdout.write(data);
});
