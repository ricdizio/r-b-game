// En Table hay demasiadas funciones que se llaman pasando como parametro la clase TableClass. 
// Esto puede generar lentitud o problemas de stack al volver (al momento de escalar)
// Discutir. La solucion es no llamar a la funcion y copiar y pegar el codigo en el lugar.

// Optimizacion: Quitar todas las funciones de alert y poner una sola con tag de parametro.
// Complicaciones: Cambiar el .algo del cliente cuando recibe el socket.
const timeBetweenRounds = 3000;

class TableClass {
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
        return new TableClass(Players, properties);
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

	alertPickedCard: function(roomName, card){
		sails.sockets.broadcast(roomName, 'deal', {card: card});
	},

	alertBalance: function(roomName, dataArray){
		sails.sockets.broadcast(roomName, 'reward', {data: dataArray});
	},

	pickedColor: function(tempTable, socketId, color){
		if(tempTable.playingPlayer.socketId == socketId){
			tempTable.pickedColors[tempTable.playingPlayer.index] = color;

			Table.alertPickedColor(tempTable.roomName, tempTable.playingPlayer, color);

			if(!tempTable.checkIfAllPicked()){
				tempTable.changeTurn();
				Table.alertTurn(tempTable.roomName, tempTable.playingPlayer);
			} else {
				Table.rewardCalculation(tempTable);

				tempTable.pickedColors = new Array();
				setTimeout(function(){
					tempTable.changeTurn();
					Table.alertTurn(tempTable.roomName, tempTable.playingPlayer);
				}, timeBetweenRounds);
				
			}
			
		}
	},

	rewardCalculation: function(tempTable){
		var card = Deck.dealCard(tempTable.deck, true)
		Table.alertPickedCard(tempTable.roomName, card);
		var winnerNumber = Table.calculateWinners(tempTable, card);

		if(winnerNumber == 0){
			Table.houseWon(tempTable);
		} else if(winnerNumer == tempTable.roomCapacity){
			Table.poolRequest(tempTable);
		} else{
			Table.sendReward(tempTable);
		}
	},

	houseWon: function(tempTable){

	},
	poolRequest: function(tempTable){

	},
	sendReward: function(tempTable){
		var dataArray = new Array();

		for(var i = 0; i < tempTable.pickedColors; i++){
			if(tempTable.pickedColors[i] == card.color){
				tempTable.players[i].add(prize);
				dataJSON.push({
					i: i,
					balance: tempTable.players[i].money
				});
			}
		}
		Table.alertBalance(tempTable.roomName, dataArray);
	},

	calculateWinners: function(tempTable, card){
		var filter = tempTable.pickedColors.filter(function(color){
			return (color == card.color);
		});
		return filter.length;
		// return tempTable.pickedColors.filter(function(color){return (color == card.color);}).length
	},
}