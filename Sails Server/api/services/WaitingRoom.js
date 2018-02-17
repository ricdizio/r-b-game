// IDEA: Booleano que indique si la mesa esta lista para lanzarse o no. Este booleano se verifica cuando el creador de la sala le da click a iniciar mesa.
// Esto se hace por si el creado de la sala hace un .post desde consola cuando los jugadores aun no estan listos.
// Se vuelve true si todos los jugadores han elegido carta. False si no. Si alguien se sale de la sala cuando todos estan listos se vuelve false.

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
            roomName: this.roomName, // Esto se hizo para evitar un problema de referencia circular
            type: 0, // 0 normal. 1 vip
            lock: 0, // 0 privado, 1 publico
            roomPassword: '',
            roomBet: 100,
            roomCapacity: 3,
            turnTime: 30000,
            rounds: 5
        }
    }
    nicks(){
        return this.players.map(a => a.nickName);
    }

    addPickedCard(card, socketId){
        var socketIds = this.players.map(a => a.socketId);
        var index = socketIds.indexOf(socketId);
        this.pickedCards[index] = card;

        // this.pickedCards[this.players.map(a => a.socketId).indexOf(socketId)] = card;
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
        // sails.sockets.broadcast(this.properties.roomName, 'waitingRoomLeft', {} , this.players.splice(index, 1).req); ESTO NO VA AQUI
		// this.pickedCards.splice(index, 1); NO HACER SPLICE, REVISAR SI RUEDA EL ARRAY
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
    }
}