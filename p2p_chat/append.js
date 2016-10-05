var levelup = require('levelup')
var scuttleup = require('scuttleup')

var db = levelup("./mydb2")

var log = scuttleup(db)

// var changes = log.createReadStream({
//   live: true
// })
//
// changes.on('data', () => {
//   console.log(data)
// })
//
// var seq = 0;

// var input = {
//   id : 'foobar',
//   seq : 0,
//   message: "hello this is first message"
//
// }
var input = 'hello world'

console.log('made it here')

log.append(input)
