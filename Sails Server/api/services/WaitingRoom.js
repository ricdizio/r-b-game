class WaitingRoom {
	constructor(roomName) {
        // Room and default settings
        this.roomName = roomName;
		this.roomCreator;
		this.nickNamesArray = new Array();
		this.pickedCards = new Array();
		this.players = new Array();
        this.dealtCounter = 0;
        
        this.properties = {
            roomName: this.roomName,
            type: 0, // 0 normal. 1 vip
            lock: 0, // 0 privado, 1 publico
            roomPassword: '',
            roomBet: 100,
            roomCapacity: 3,
            turnTime: 30000,
            rounds: 5
        }
    }
    
    addPlayer(Player){
        if(this.players.length == 0){
            this.roomCreator = Player;
        }
        Player.roomIn = this.roomName;
        this.players.push(Player);
    }

    kickPlayer(Player){
        if(Player == this.roomCreator){
            this.roomCreator = this.players[1];
        }
        var index = this.players.indexOf(Player);
        sails.sockets.broadcast(this.properties.roomName, 'waitingRoomLeft', {} , this.players.splice(index, 1).req);
		//this.pickedCards.splice(index, 1);
    }

    updateType(type) {
        this.properties.type = type;
    }

    updateLock(lock){
        this.properties.lock = lock;
    }

    updatePassword(password) {
        this.properties.password = password;
    }

    updateBet(bet) {
        this.properties.bet = bet;
    }

    updateCapacity(capacity) {
        this.properties.capacity = capacity;
    }

    updateTurnTime(turnTime) {
        this.properties.turnTime = turnTime;
    }

    updateRounds(rounds) {
        this.properties.rounds = rounds;
    }
}

module.exports = {
    create: function(roomName){
        return new WaitingRoom(roomName);
    },
    getRoomByReq: function(req){
        var socketId = sails.sockets.getId(req);
        var tempPlayer = HashMap.userMap.get(socketId); // Player
        var roomIn = tempPlayer.roomIn;
        return HashMap.roomMap.get(roomIn); // WaitingRoom
    }
}