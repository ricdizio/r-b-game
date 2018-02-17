class Table {
	constructor(players, propertiesJSON) {
		// Settings.
		this.roomName = propertiesJSON.roomName;
		this.type = propertiesJSON.type;
		this.roomCapacity = propertiesJSON.roomCapacity;
		this.rounds = propertiesJSON.rounds;
		this.initialMoney = propertiesJSON.roomBet * propertiesJSON.rounds;
		this.turnTime = propertiesJSON.turnTime;
		this.roomBet = propertiesJSON.roomBet;

		// Initial values
		this.playTurn = 0;

		this.initiatePlayers(players, this.initialMoney);
		this.players = players;

		this.deck = Deck.get();
		Deck.shuffle(Deck.shuffle(this.deck));

		// Playing variables
		this.pool = 0;
		this.playingPlayer;
		this.pickedColors = new Array();

		var self = this;

		setTimeout(function () {
			self.start();
		}, 5000);
	}

	// Funciones iniciales.

	initiatePlayers(players, initialMoney) {
		for (var i = 0; i < players.length; i++) {
			players[i].money = initialMoney;
			players[i].index = i;
		}
	}

	// Funcionamiento en orden del juego.

	start() {
		this.constantBet(this.roomBet);
		this.playingPlayer = this.players[0];
		Table.alertTurn(this.roomName, this.playingPlayer);
	}

	constantBet(money) {
		/*this.players.forEach( function (arrayItem){
			arrayItem.substract(money);
		});*/
		var temporalArray = new Array();
		for (var i = 0; i < this.players; i++) {
			this.players[i].substract(this.roomBet);
			temporalArray.push(this.players[i].money);
			this.pool += this.roomBet;
		}
		Table.alertConstantBet(temporalArray);
	}

	chooseCards(){

	}

	reward() {

	}

	changeTurn(){
		var index = this.playingPlayer.index;
		if(++index >= this.roomCapacity){
			index = 0;
		}
		this.playingPlayer = this.players[index];
		// para los timeouts
		// sails.controllers.yourControllerName.yourFunction()
	}

	checkIfAllPicked(){
		// Si el arreglo no tiene undefined (todos eligieron) y tiene el tamaño correcto retorna true
		return (!(this.pickedColors.includes(undefined)) && (this.pickedColors.length == this.roomCapacity)); 
	}
}

module.exports = {
    create: function (Players, properties){
        return new Table(Players, properties);
	},

	alertTurn: function (roomName, player) {
		sails.sockets.broadcast(roomName, 'play', {index: player.index});
	},

	alertConstantBet: function (roomName, balanceArray) {
		sails.sockets.broadcast(roomName, 'substractConstantBet', {balanceArray: balanceArray});
	},

	alertPickedColor: function (roomName, player, color) {
		//sails.sockets.broadcast(roomName, 'bettedColor', {index: player.index, color: color});
	},

	pickedColor: function(tempTable, socketId, color){
		if(tempTable.playingPlayer.socketId == socketId){
			tempTable.pickedColors[tempTable.playingPlayer.index] = color;

			Table.alertPickedColor(tempTable.roomName, tempTable.playingPlayer, color);

			if(tempTable.checkIfAllPicked()){
				// HACER TODO
				
			}
			tempTable.changeTurn();
			Table.alertTurn(tempTable.roomName, tempTable.playingPlayer);
		}
	},

}