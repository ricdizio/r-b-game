// Revisar boton de start table cuando alguien se sale de la sala o se cambia el parametro de jugadores. Por ahora solo se revisa cuando alguien elige
// una carta, pero si alguien se sale o cambian el parametro no se esta revisando.

// Eliminar del hashmap la sala cuando los jugadores en ella sean igual a 0.

module.exports = {
	updateName: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('roomName', req.param('roomName'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomName', {roomName: req.param('roomName')});
			}
		}
	},

	updateType: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('type', req.param('type'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomRounds', {type: req.param('type')});
			}
		}
	},
	updateLock: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('lock', req.param('lock'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomLock', {lock: req.param('lock')});
			}
		}
	},
	updatePassword: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('roomPassword', req.param('password'));
			}
		}
	},
	updateBet: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('roomBet', req.param('bet'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomBet', {bet: req.param('bet')});
			}
		}
	},
	updateCapacity: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('roomCapacity', req.param('capacity'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomCapacity', {capacity: req.param('capacity')});
			}
		}
	},
	updateTurnTime: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('turnTime', req.param('turnTime'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomTurnTime', {turnTime: req.param('turnTime')});
			}
		}
	},
	updateRounds: function(req, res) {
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateProperty('rounds', req.param('rounds'));
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
				sails.sockets.broadcast(tempRoom.roomCreator.socketId, 'startTableEnabled');
			}
			return res.json({card: card});
		}
	},

	leaveWaitingRoom: function(req, res){
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			var tempPlayer = HashMap.userMap.get(socketId);
			var index = tempRoom.kickPlayer(tempPlayer);
			sails.sockets.leave(req, tempRoom.roomName);
			sails.sockets.join(req, 'lobby');
			sails.sockets.broadcast(tempRoom.roomName, 'waitingRoomKick', {index: index});
			return res.json({});
		}
	},

	startTable: function(req, res){
		if (req.isSocket) {
			var tempRoom = HashMap.getRoomByReq(req);
			var socketId = sails.sockets.getId(req);
			if(tempRoom.roomCreator.socketId == socketId){
				var players = Player.sortPlayers(tempRoom.players, tempRoom.pickedCards);
				var nicks = players.map(a => a.nickName);
        let totalMoney = tempRoom.properties.roomBet * tempRoom.properties.rounds;

				for(let i = 0; i < players.length; i++){
          sails.sockets.broadcast(players[i].socketId, 'logicalPlayers', {nicks: nicks, myNick: players[i].nickName});
          Database.substractMoney(players[i].id, totalMoney);
          players[i].add(totalMoney);
				}

				HashMap.roomMap.delete(tempRoom.properties.roomName);
				HashMap.tableMap.set(tempRoom.properties.roomName, Table.create(players, tempRoom.properties));
				
				sails.sockets.broadcast(tempRoom.properties.roomName, 'tableStarted', {properties: tempRoom.properties});
			}
		}
	}
}