
var levelup = require('levelup')
var db = levelup('./mydb')

db.get('hello', function(err, value) {
  if(err) return console.log("name dos not exist " + err);
  console.log("hello=" + value)
});
