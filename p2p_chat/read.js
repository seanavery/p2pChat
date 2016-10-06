var levelup = require('levelup')
var scuttleup = require('scuttleup')

var db = levelup('./mydb2')
var log = scuttleup(db);

var changes = log.createReadStream({
  avalueEncoding: 'utf-8',
  live : true
})

changes.on('data', (data) => {
  console.log(data.peer + ' ' + data.seq + ' ' + data.entry);
})
