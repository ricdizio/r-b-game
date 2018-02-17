// Revisar boton de start table cuando alguien se sale de la sala o se cambia el parametro de jugadores. Por ahora solo se revisa cuando alguien elige
// una carta, pero si alguien se sale o cambian el parametro no se esta revisando.

// Eliminar del hashmap la sala cuando los jugadores en ella sean igual a 0.
// DESCOMENTAR LINEA 97. Comentada para pruebas de 2 jugadores.
module.exports = {
	updateName: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateRoomName(req.param('roomName'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomName', {roomName: req.param('roomName')});
			}
		}
	},

	updateType: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateType(req.param('type'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomRounds', {type: req.param('type')});
			}
		}
	},
	updateLock: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateLock(req.param('lock'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomLock', {lock: req.param('lock')});
			}
		}
	},
	updatePassword: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updatePassword(req.param('password'));
			}
		}
	},
	updateBet: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateBet(req.param('bet'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomBet', {bet: req.param('bet')});
			}
		}
	},
	updateCapacity: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateCapacity(req.param('capacity'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomCapacity', {capacity: req.param('capacity')});
			}
		}
	},
	updateTurnTime: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateTurnTime(req.param('turnTime'));
				console.log(req.param('turnTime'))
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomTurnTime', {turnTime: req.param('turnTime')});
			}
		}
	},
	updateRounds: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateRounds(req.param('rounds'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomRounds', {rounds: req.param('rounds')});
			}
		}
	},

	dealWaitingRoomCard: function(req, res){
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			var card = Deck.dealCustomCard(tempRoom.pickedCards);
			tempRoom.addPickedCard(card, socketId);
			sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomDealtCard', {pickedCards: tempRoom.pickedCards});

			if(!(tempRoom.pickedCards.includes(undefined)) && (tempRoom.pickedCards.length == tempRoom.properties.roomCapacity)){
			//if(!(tempRoom.pickedCards.includes(undefined))){
				sails.sockets.broadcast(tempRoom.roomCreator.socketId, 'startTableEnabled');
			}
			return res.json({card: card});
		}
	},

	startTable: function(req, res){
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				var players = Player.sortPlayers(tempRoom.players, tempRoom.pickedCards);
				var nicks = players.map(a => a.nickName);

				for(var i = 0; i < players.length; i++){
					sails.sockets.broadcast(players[i].socketId, 'logicalPlayers', {nicks: nicks, myNick: players[i].nickName});
				}

				HashMap.roomMap.delete(tempRoom.properties.roomName);
				HashMap.tableMap.set(tempRoom.properties.roomName, Table.create(players, tempRoom.properties));
				
				sails.sockets.broadcast(tempRoom.properties.roomName, 'tableStarted', {properties: tempRoom.properties});
			}
		}
	}
}