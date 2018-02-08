const HashMap = require('hashmap');

var userMap = new HashMap(); // key: socket.id, data: clase Player
var roomMap = new HashMap(); // key: roomName, data: waitingRoom o Table

module.exports = {
    userMap: userMap,
    roomMap: roomMap
}