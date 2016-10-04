var levelup = require('levelup');

var db = levelup('./mydb');

db.put('hello', 'world', (err) => {
  if(err) return console.log("error in db.put is " + err);
  console.log('inserted in to leveldb: ' + 'hello = world');
});
