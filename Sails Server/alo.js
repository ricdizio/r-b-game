const HashMap = require('hashmap');

var userMap = new HashMap(); // key: socket.id, data: clase Player

var object = {
  nick: 1,
  id: 2
}
var object2 = {
  nick: 3,
  id: 4
}

var players = ['noya', 'victor', 'dizio'];
var cards = [7, 2, 5];

    var tempCards = cards.map(a => a.value);
    var result = [];
    
    for(var i = 0; i < players.length; i++){
      result.push({
        players: players[i],
        value: cards[i]
      })
    }

    result.sort(function(a, b) {
      return ((a.value < b.value) ? 1 : ((a.value == b.value) ? 0 : -1));
    });
    var players = result.map(a => a.players);

console.log(players);
