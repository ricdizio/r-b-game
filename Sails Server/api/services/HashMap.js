const HashMap = require('hashmap');

var userMap = new HashMap(); // key: socket.id, data: clase Player
var roomMap = new HashMap(); // key: roomName, data: waitingRoom
var tableMap = new HashMap(); // key: roomName, data: table

module.exports = {
    lobbyProperties: function(){
        return this.roomMap.values().map(a => a.properties); // Retorna un arreglo
    },
    getRoomByReq: function(req){
        /*var socketId = sails.sockets.getId(req);
        var tempPlayer = HashMap.userMap.get(socketId); // Player
        var roomIn = tempPlayer.roomIn;
        return HashMap.roomMap.get(roomIn); // WaitingRoom*/
        return this.roomMap.get(this.userMap.get(sails.sockets.getId(req)).roomIn); // WaitingRoom
    },
    getTableByReq: function(req){
        return this.roomMap.get(this.tableMap.get(sails.sockets.getId(req)).roomIn); // WaitingRoom
    },
    userMap: userMap,
    roomMap: roomMap,
    tableMap: tableMap
}