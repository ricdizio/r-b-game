// Cuidado: cuando el usuario entra a una sala y luego se cambia la apuesta a una mayor y no le alcanza.
// Solucion: No permitir al lider cambiar la apuesta una vez creada la sala.

module.exports = {
  joinLobby: function (req, res) {
    // console.log(req.session.authenticated)
    if (req.isSocket) {
      sails.sockets.join(req, 'lobby');
      let socketId = sails.sockets.getId(req);
      let nickName = req.session.User.nickName;
      let id = req.session.User.id;

      if (!HashMap.userMap.has(socketId)) {
        HashMap.userMap.set(socketId, Player.create(socketId, nickName, id, req));
      }
      return res.json({ waitingRooms: HashMap.lobbyProperties() });
    }
  },

  refreshLobby: function (req, res) {
    if (req.isSocket) {
      return res.json({ waitingRooms: HashMap.lobbyProperties() });
    }
  },

  createWaitingRoom: function (req, res) {
    if (req.isSocket) {
      var socketId = sails.sockets.getId(req);

      var roomName = req.param('roomName');
      // CUIDADO: Se puso temporalmente el socketId como nombre de la sala para poder probar multiples salas.
      // roomName = socketId;

      if ((!HashMap.roomMap.has(roomName)) && (!HashMap.tableMap.has(roomName))) {
        sails.sockets.leave(req, 'lobby');
        sails.sockets.join(req, roomName);

        var tempRoom = WaitingRoom.create(roomName);
        var tempPlayer = HashMap.userMap.get(socketId);

        tempRoom.addPlayer(tempPlayer);
        HashMap.roomMap.set(roomName, tempRoom);
        //sails.sockets.broadcast('lobby', 'refreshRooms', {waitingRooms: HashMap.lobbyProperties()});

        sails.sockets.broadcast(roomName, 'waitingRoomJoin', { nicks: tempRoom.nicks() });
      }
    }
  },

  joinWaitingRoom: function (req, res) {
    if (req.isSocket) {
      let roomName = req.param('roomName');
      let tempRoom = HashMap.roomMap.get(roomName);

      if (req.session.User.tokens < tempRoom.properties.roomBet * tempRoom.properties.rounds) {
        return res.json({message: 'No tienes dinero suficiente.'});
      }
      else {
        let socketId = sails.sockets.getId(req);
        let tempPlayer = HashMap.userMap.get(socketId);

        if (tempRoom.addPlayer(tempPlayer)) { // Si se unio correctamente (es decir, que no estas tu mismo dentro por alguna razon)
          
          sails.sockets.leave(req, 'lobby');
          sails.sockets.join(req, roomName);
          sails.sockets.broadcast(roomName, 'waitingRoomJoin', { nicks: tempRoom.nicks() });
        }
      }
    }
  },
}