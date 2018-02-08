class Player {
	constructor(socketId, nickName, req, roomIn) {
		this.socketId = socketId;
        this.nickName = nickName;
        this.req = req;
        this.roomIn = 'lobby';
		this.money;
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
    }
}