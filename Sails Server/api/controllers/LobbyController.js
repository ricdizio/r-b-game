module.exports = {
	joinLobby: function(req, res){
		if (req.isSocket) {
			sails.sockets.join(req, 'lobby');
			var socketId = sails.sockets.getId(req);
			var nickName = req.session.User.nickName;

			if(!HashMap.userMap.has(socketId)){
				HashMap.userMap.set(socketId, Player.create(socketId, nickName, req));
			}
			return res.json({waitingRooms: HashMap.lobbyProperties()});
		}
	},

	refreshLobby: function(req, res){
		if (req.isSocket) {
			return res.json({waitingRooms: HashMap.lobbyProperties()});
		}
    },

    createWaitingRoom: function(req, res){
		if (req.isSocket) {
			var socketId = sails.sockets.getId(req);
			var roomName = req.param('roomName');

			if((!HashMap.roomMap.has(roomName)) && (!HashMap.tableMap.has(roomName))){
				sails.sockets.leave(req, 'lobby');
				sails.sockets.join(req, roomName);

				var tempRoom = WaitingRoom.create(roomName);
				var tempPlayer = HashMap.userMap.get(socketId);

				tempRoom.addPlayer(tempPlayer);
				HashMap.roomMap.set(roomName, tempRoom);
                //sails.sockets.broadcast('lobby', 'refreshRooms', {waitingRooms: HashMap.lobbyProperties()});
                sails.sockets.broadcast(roomName, 'waitingRoomJoin', {nicks: tempRoom.nicks()});
			}
		}
	},

	joinWaitingRoom: function(req, res) {
		if (req.isSocket) {
			// Revisar dinero.
			var socketId = sails.sockets.getId(req);
			var tempPlayer = HashMap.userMap.get(socketId);
			var roomName = req.param('roomName');
			var tempRoom = HashMap.roomMap.get(roomName);

			sails.sockets.leave(req, 'lobby');
			sails.sockets.join(req, roomName);

			tempRoom.addPlayer(tempPlayer);

            sails.sockets.broadcast(roomName, 'waitingRoomJoin', {nicks: tempRoom.nicks()});
		}
	},
}