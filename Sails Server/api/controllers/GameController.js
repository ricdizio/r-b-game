/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	play: function(req, res){
		return res.view('game/index',{title:"R&B - Play"});
	},

	joinLobby: function(req, res){
		if (req.isSocket) {
			sails.sockets.join(req, 'lobby');
			var socketId = sails.sockets.getId(req);
			var nickName = req.session.User.nickName;
			HashMap.userMap.set(socketId, Player.create(socketId, nickName, req));
			// retornarle las salas
		}
	},

	createWaitingRoom: function(req, res){
		if (req.isSocket) {
			var socketId = sails.sockets.getId(req);
			var roomName = req.param('roomName');

			if(!HashMap.roomMap.has(roomName)){
				sails.sockets.leave(req, 'lobby');
				sails.sockets.join(req, roomName);

				var tempRoom = WaitingRoom.create(roomName);
				var tempPlayer = HashMap.userMap.get(socketId);
				tempRoom.addPlayer(tempPlayer);
				HashMap.roomMap.set(roomName, tempRoom);
				
				sails.sockets.broadcast('lobby', 'refreshRooms', {waitingRooms: HashMap.roomMap.values()}, req);
			}
		}
	},

	joinWaitingRoom: function(req, res) {
		if (req.isSocket) {
			// Revisar dinero
			var socketId = sails.sockets.getId(req);
			var tempPlayer = HashMap.userMap.get(socketId);
			var roomName = req.param('roomName');
			var tempRoom = HashMap.roomMap.get(roomName);

			sails.sockets.leave(req, 'lobby');
			sails.sockets.join(req, roomName);

			tempRoom.addPlayer(tempPlayer);

		}
	},

	updateType: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateType(req.param('type'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomRounds', {type: req.param('type')});
			}
		}
	},
	updateLock: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateLock(req.param('lock'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomLock', {lock: req.param('lock')});
			}
		}
	},
	updatePassword: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updatePassword(req.param('password'));
			}
		}
	},
	updateBet: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateBet(req.param('bet'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomBet', {bet: req.param('bet')});
			}
		}
	},
	updateCapacity: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateCapacity(req.param('capacity'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomCapacity', {capacity: req.param('capacity')});
			}
		}
	},
	updateTurnTime: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateTurnTime(req.param('turnTime'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomTurnTime', {turnTime: req.param('turnTime')});
			}
		}
	},
	updateRounds: function(req, res) {
		if (req.isSocket) {
			var tempRoom = WaitingRoom.getRoomByReq(req);

			if(tempRoom.roomCreator.socketId == socketId){
				tempRoom.updateRounds(req.param('rounds'));
				sails.sockets.broadcast(tempRoom.properties.roomName, 'waitingRoomRounds', {rounds: req.param('rounds')});
			}
		}
	},
	chat: function(req, res){
		if(req.isSocket){
			var socketId = sails.sockets.getId(req);
			console.log(socketId)
			var tempPlayer = HashMap.userMap.get(socketId); // Player
			console.log(tempPlayer)
			var roomIn = tempPlayer.roomIn;
			sails.sockets.broadcast(roomIn, 'chat', {id: tempPlayer.nickName, message: req.param('message')});
		}
	}
}

