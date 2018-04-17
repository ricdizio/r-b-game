// Cuidado con el reinicio de estas propiedades al salir de una sala.

class Player {
	constructor(socketId, nickName, id, req, roomIn) {
		this.socketId = socketId;
    this.nickName = nickName;
    this.id = id;
    this.req = req;
    this.roomIn = 'lobby';
		this.money = 0;
		this.playerIndex;
	}

	add(money) {
		this.money += money;
	}

	substract(money) {
		this.money -= money;
	}
}

module.exports = {
  create: function(socketId, nickName, req){
      return new Player(socketId, nickName, req);
	},
	sortPlayers: function(players, cards){
		var result = new Array();
		for(var i = 0; i < players.length; i++){
			result.push({
				players: players[i],
				value: cards[i].value
			});
		}
		result.sort(function(a, b) {
			return ((a.value < b.value) ? 1 : ((a.value == b.value) ? 0 : -1));
		});
		return result.map(a => a.players);
	}
}