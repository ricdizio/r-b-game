module.exports = {
	joinLobby: function(req, res){
		if (req.isSocket) {
			sails.sockets.join(req, 'lobby');
			var socketId = sails.sockets.getId(req);
			console.log(socketId)
			var nickName = req.session.User.nickName;
			if(!HashMap.userMap.has(socketId)){
				HashMap.userMap.set(socketId, Player.create(socketId, nickName, req));
			}
			
			console.log(HashMap.userMap.size)
			// retornarle las salas
		}
	},

	refreshLobby: function(req, res){
		if (req.isSocket) {
			var socketId = sails.sockets.getId(req);
			var rooms = HashMap.roomMap.values();
			var result = rooms.map(a => a.properties);
			
			sails.sockets.broadcast(socketId, 'refreshRooms', {waitingRooms: result});
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
				var rooms = HashMap.roomMap.values();
				var result = rooms.map(a => a.properties);
                var nicks = tempRoom.players.map(a => a.nickName);
                
                sails.sockets.broadcast('lobby', 'refreshRooms', {waitingRooms: result});
                sails.sockets.broadcast(roomName, 'waitingRoomJoin', {nicks: nicks});
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

            var nicks = tempRoom.players.map(a => a.nickName);
            sails.sockets.broadcast(roomName, 'waitingRoomJoin', {nicks: nicks});
		}
	},
}