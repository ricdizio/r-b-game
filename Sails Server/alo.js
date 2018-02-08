const HashMap = require('hashmap');

var userMap = new HashMap(); // key: socket.id, data: clase Player

var array = new Array();
var object = {
  nick: 1,
  id: 2
}
var object2 = {
  nick: 12,
  id: 2
}

array.push(object);

userMap.set('test', object);

var x = userMap.search(object2);
console.log(x);