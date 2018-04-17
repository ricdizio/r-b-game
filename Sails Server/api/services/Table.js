// En Table hay demasiadas funciones que se llaman pasando como parametro la clase TableClass. 
// Esto puede generar lentitud o problemas de stack al volver (al momento de escalar)
// Discutir. La solucion es no llamar a la funcion y copiar y pegar el codigo en el lugar.

// Optimizacion: Quitar todas las funciones de alert y poner una sola con tag de parametro.
// Complicaciones: Cambiar el .algo del cliente cuando recibe el socket.
const timeBetweenRounds = 4000;
const timeAfterTableEnd = 10000;

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
		this.timeout;

		setTimeout(() => this.start(), 3000);
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
		this.constantBet();
		Table.alertBalance(this.roomName, this.players.map(a => a.money));
		this.playingPlayer = this.players[0];
		Table.alertTurn(this.roomName, this.playingPlayer);
		this.putTimeout();
	}

	constantBet() {
		/*this.players.forEach( function (arrayItem){
			arrayItem.substract(money);
		});*/
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].substract(this.roomBet);
			this.pool += this.roomBet;
		}
	}

	changeTurn(){
		var index = this.playingPlayer.index + 1;
		if(index >= this.roomCapacity){
			index -= this.roomCapacity;
		}
		this.playingPlayer = this.players[index];
		// para los timeouts
		// sails.controllers.yourControllerName.yourFunction()
	}

	checkIfAllPicked(){
		// Si el arreglo no tiene undefined (todos eligieron) y tiene el tamaño correcto retorna true
		return (!(this.pickedColors.includes(undefined)) && (this.pickedColors.length == this.roomCapacity)); 
	}

	putTimeout(){
		this.timeout = setTimeout(() => {
			Table.alertTimeout(this.playingPlayer.socketId);
			Table.pickedColor(this, Deck.randomColor());
		}, this.turnTime);
	}

	eraseTimeout(){
		clearTimeout(this.timeout);
	}
}

module.exports = {
    create: function (Players, properties){
        return new TableClass(Players, properties);
	},

	alertTurn: function (roomName, player) {
		sails.sockets.broadcast(roomName, 'play', {index: player.index});
	},

	alertBalance: function (roomName, balanceArray) {
		sails.sockets.broadcast(roomName, 'updateBalance', {data: balanceArray});
	},

	alertPickedColor: function (roomName, player, color) {
		//sails.sockets.broadcast(roomName, 'bettedColor', {index: player.index, color: color});
	},

	alertPickedCard: function(roomName, card){
		sails.sockets.broadcast(roomName, 'deal', {card: card});
	},

	alertReward: function(roomName, dataArray){
		sails.sockets.broadcast(roomName, 'reward', {data: dataArray});
	},

	alertTimeout: function(socketId){
		sails.sockets.broadcast(socketId, 'timedOut');
	},

	end: function(tempTable){
    for(let i = 0; i < tempTable.roomCapacity; i++){
      Database.addMoney(tempTable.players[i].id, tempTable.players[i].money);
    }
    
		setTimeout(() => {
			sails.sockets.broadcast(tempTable.roomName, 'tableEnd');
			sails.sockets.addRoomMembersToRooms(tempTable.roomName, 'lobby'); // Movemos a todos los usuarios al lobby.
			sails.sockets.removeRoomMembersFromRooms(tempTable.roomName, tempTable.roomName); // Removemos a los usuarios de la socket room.
			HashMap.tableMap.delete(tempTable.roomName);
		}, timeAfterTableEnd);
	},

	pickedColor: function(tempTable, color){
		tempTable.eraseTimeout();
		tempTable.pickedColors[tempTable.playingPlayer.index] = color;

		Table.alertPickedColor(tempTable.roomName, tempTable.playingPlayer, color);

		if(!tempTable.checkIfAllPicked()){
			tempTable.changeTurn();
			Table.alertTurn(tempTable.roomName, tempTable.playingPlayer);
			tempTable.putTimeout();
		} else {
			Table.reward(tempTable);
			Table.alertBalance(tempTable.roomName, tempTable.players.map(a => a.money));
			tempTable.changeTurn();
			if(++tempTable.playTurn < tempTable.rounds) {
				setTimeout(() => {
					tempTable.changeTurn();
					tempTable.constantBet();
					Table.alertBalance(tempTable.roomName, tempTable.players.map(a => a.money));
					Table.alertTurn(tempTable.roomName, tempTable.playingPlayer);
					tempTable.putTimeout();
				}, timeBetweenRounds);
			} else {
				console.log('Mesa terminada');
				Table.end(tempTable);
			}
		}
	},

	reward: function(tempTable){
		var card = Deck.dealCard(tempTable.deck, true)
		Table.alertPickedCard(tempTable.roomName, card);
		var winnerNumber = Table.calculateWinners(tempTable, card);

		// if(winnerNumber == tempTable.roomCapacity){
		// 	Table.poolRequest(tempTable);
		// } else{
		// 	let prize;
		// 	if(winnerNumber != 0){
		// 		prize = tempTable.pool / winnerNumber;
		// 	} else{
		// 		prize = 0;
		// 	}

		// 	Table.sendReward(tempTable, prize, card);
		// 	tempTable.pickedColors = new Array();
		// }

		let prize;
		if(winnerNumber != 0){
			prize = tempTable.pool / winnerNumber;
		} else{
			prize = 0;
		}

		Table.sendReward(tempTable, prize, card);
		tempTable.pickedColors = new Array();
	},

	poolRequest: function(tempTable){
	},

	sendReward: function(tempTable, prize, card){
		var dataArray = new Array();
		var won;

		for(var i = 0; i < tempTable.pickedColors.length; i++){
			won = false;
			if(tempTable.pickedColors[i] == card.color){
				tempTable.players[i].add(prize);
				won = true;
			}
			dataArray.push({
				index: i,
				balance: tempTable.players[i].money,
				won: won
			});
		}

		tempTable.pool = 0;
		Table.alertReward(tempTable.roomName, dataArray);
	},

	calculateWinners: function(tempTable, card){
		var filter = tempTable.pickedColors.filter(function(color){
			return (color == card.color);
		});
		return filter.length;
		// return tempTable.pickedColors.filter(function(color){return (color == card.color);}).length
	},
}