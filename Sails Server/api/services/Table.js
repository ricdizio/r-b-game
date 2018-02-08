class Table {
	constructor(Players, socketRoom, type, maximumPlayers, maximumRounds, initialMoney, playTimeoutTime, constantMoneyBet) {
		this.socketRoom = socketRoom;
		this.type = type;
		this.maximumPlayers = maximumPlayers;
		this.maximumRounds = maximumRounds;
		this.initialMoney = initialMoney;
		this.playTimeoutTime = playTimeoutTime;
		this.constantMoneyBet = constantMoneyBet;
		this.playTurn = 0;

		this.initiatePlayers(Players, initialMoney);
		this.players = Players;
		this.nickNamesArray;

		this.pool = 0;

		this.round = 0;
		this.poolAccept = 0;
		this.poolAnswer = 0;

		this.poolTimeoutVariable;
		this.chooseFirstTimeoutVariable;
		this.colorBets = new Array();

		this.deck = this.generateDeck(); // QUITAR,
		this.deck = this.shuffle(this.deck);
		this.deck = this.shuffle(this.deck);
		var self = this;

		setTimeout(function () {
			self.start();
		}, 5000);
	}

	// Funciones iniciales.

	initiatePlayers(players, initialMoney) {
		for (var i = 0; i < players.length; i++) {
			//temporalObjectArray[i] = new Player(playersId[i], initialMoney, i);
			players[i].money = initialMoney;
			players[i].index = i;
		}
	}

	generateDeck() {
		var temporalArray = new Array();
		for (var i = 0; i < decks; i++) {
			for (var j = 0; j < numbers.length; j++) {
				for (var k = 0; k < suits.length; k++) {
					temporalArray.push(new Card(j * 4 + k, numbers[j], suits[k]));
				}
			}
		}
		return temporalArray;
	}

	shuffle(array) {
		var newArray = array;
		var arrayLength = array.length;
		var randomNumber;
		var temp;

		while (arrayLength) {
			randomNumber = Math.floor(Math.random() * arrayLength--);
			temp = newArray[arrayLength];
			newArray[arrayLength] = newArray[randomNumber];
			newArray[randomNumber] = temp;
		}

		return newArray;
	}

	// Funcionamiento en orden del juego.

	start() {
		if (this.round < this.maximumRounds) {
			io.sockets.to(this.socketRoom).emit('round', this.round++);
			var betCounter = 0;
			this.constantBet();
		}
		else {
			this.end();
		}
	}

	constantBet() { // Funciona que apuesta automaticamente X cantidad de dinero.
		var temporalArray = new Array();
		for (var i = 0; i < this.maximumPlayers; i++) {
			this.players[i].substract(this.constantMoneyBet);
			temporalArray.push(this.players[i].money);
			this.pool += this.constantMoneyBet;
		}
		console.log(temporalArray);
		io.sockets.to(this.socketRoom).emit('substractConstantBet', temporalArray);
		this.chooseColor();
	}

	bet(turn, betCounter) { // Funcion de apuesta no constante. Se utilizaria en mesas VIP.
		var self = this;
		var currentSocketId = this.players[turn].socketId;

		io.sockets.sockets[currentSocketId].on('getBet', betFunction);

		function betFunction(money) {
			clearTimeout(setTime);
			io.sockets.sockets[currentSocketId].removeListener('getBet', betFunction);
			io.sockets.to(self.socketRoom).emit('bettedMoney', money, turn);
			self.players[turn].substract(money);
			self.pool += money;

			var temporalObject = {
				counter: betCounter,
				turn: turn
			}

			if (self.checkCounters(temporalObject, self.maximumPlayers)) { //checkCounters suma internamente los contadores.
				self.bet(temporalObject.turn, temporalObject.counter);
			}
			else {
				self.chooseColor();
			}
		}

		io.sockets.to(this.socketRoom).emit('bet', currentSocketId, turn);

		var setTime = setTimeout(function () {
			io.sockets.sockets[currentSocketId].removeListener('getBet', betFunction);
			io.sockets.to(self.socketRoom).emit('timedOut', turn);

			var temporalObject = {
				counter: betCounter,
				turn: turn
			}

			if (self.checkCounters(temporalObject, self.maximumPlayers)) {
				self.bet(temporalObject.turn, temporalObject.counter);
			}
			else {
				self.chooseColor();
			}
		}, this.playTimeoutTime);
	}

	chooseColor() { // Funcion que controla quien elige color.
		var previousBetTurn = this.playTurn;

		if (++this.playTurn >= this.maximumPlayers) {
			this.playTurn = 0;
		}

		this.play(previousBetTurn, 0);
	}

	play(turn, playCounter) { // Funcion que controla el momento de jugar de cada jugador.
		var self = this;
		var currentSocketId = this.players[turn].socketId;

		io.sockets.sockets[currentSocketId].on('getPlay', playFunction);

		function playFunction(color) {
			clearTimeout(setTime);
			io.sockets.sockets[currentSocketId].removeListener('getPlay', playFunction);
			io.sockets.to(self.socketRoom).emit('bettedColor', color, turn);
			self.colorBets[turn] = color; // true: red, false: black.

			var temporalObject = {
				counter: playCounter,
				turn: turn
			}

			if (self.checkCounters(temporalObject, self.maximumPlayers)) {
				self.play(temporalObject.turn, temporalObject.counter);
			}
			else {
				self.reward(self.colorBets);
			}
		}

		io.sockets.to(self.socketRoom).emit('play', turn);
		console.log(turn);

		var setTime = setTimeout(function () {
			var randomPick = self.randomColor();
			io.sockets.sockets[currentSocketId].removeListener('getPlay', playFunction);
			io.sockets.to(self.socketRoom).emit('bettedColor', randomPick, turn);
			io.sockets.to(self.socketRoom).emit('timedOut', turn);
			self.colorBets[turn] = randomPick; // true: red, false: black.

			var temporalObject = {
				counter: playCounter,
				turn: turn
			}

			if (self.checkCounters(temporalObject, self.maximumPlayers)) { // Dentro de checkcounters es que se suman los contadores.
				self.play(temporalObject.turn, temporalObject.counter);
			}
			else {
				self.reward(self.colorBets);
			}
		}, this.playTimeoutTime);
	}

	reward(colorArray) {
		var card = this.dealCard(true);
		console.log(card);
		var counter = 0;
		var self = this;
		var balance = new Array();

		io.sockets.to(this.socketRoom).emit('deal', card);

		for (var i = 0; i < this.maximumPlayers; i++) {
			if (colorArray[i] == card.color) {
				counter++;
			}
		}
		if (counter == 0) {
			// House won.
			io.sockets.to(this.socketRoom).emit('reward', 0, 0, 0);
			this.pool = 0;
			this.sendReward(0, 0, false, 0, 0);
		}
		else if (counter == this.maximumPlayers && this.round != this.maximumRounds) {
			this.poolTimeoutVariable = setTimeout(function () {
				poolAnswer(false, 0, true);
			}, poolTimeout);

			this.poolAnswer = 0;

			for (var i = 0; i < this.maximumPlayers; i++) {
				io.sockets.sockets[this.players[i].socketId].on('getPoolAnswer', poolAnswer);
			}

			io.sockets.to(this.socketRoom).emit('poolRequest'); // Solicitud para acumular

			function poolAnswer(poolAnswerVar, socketId, timedOut) {
				if(!timedOut){
					if (poolAnswerVar) {
						self.poolAccept++;
					}
					self.poolAnswer++;
	
					if (self.poolAccept == self.maximumPlayers) { // Si todos dicen que si.
						self.sendReward(0, 0, false, 0, 0);
						io.sockets.to(this.socketRoom).emit('poolAccepted');
					}
					else if (self.poolAnswer == self.maximumPlayers) { // Si alguien dice que no, quitamos los event listeners de todos y les hacemos reward.
						for (var i = 0; i < self.maximumPlayers; i++) {
							io.sockets.sockets[self.players[i].socketId].removeListener('getPoolAnswer', poolAnswer);
						}
						self.sendReward(colorArray, counter, true, card, balance); // Enviamos reward normalmente.
					}
				} else {
					self.sendReward(colorArray, counter, true, card, balance); // Enviamos reward normalmente.
				}
			}
		}
		else {
			this.sendReward(colorArray, counter, true, card, balance); // Enviamos reward normalmente.
		}
	}

	sendReward(colorArray, counter, go, card, balance) {
		clearTimeout(this.poolTimeoutVariable);
		var self = this;
		console.log('GO EN REWARD' + go);
		if (go) {
			var prize = this.pool / counter;

			var winningPlayers = new Array();
			var ids = new Array();
			
			
			for(var i = 0; i < this.maximumPlayers; i++){
				if(colorArray[i] == card.color){
					winningPlayers.push(i);
					this.players[i].add(prize);
				}
				balance.push(this.players[i].money);
				ids.push(this.players[i].socketId);
			}
			this.pool = 0;
			console.log('SOCKET REWARD');
			io.sockets.to(this.socketRoom).emit('reward', winningPlayers, prize, balance); // REVISAR
		}

		setTimeout(function () {
			self.start();
		}, timeBetweenRounds);
	}

	end() {
		console.log('Game Over');
		io.sockets.to(this.socketRoom).emit('tableEnd');

		// Remover listeners de chat
		// io.sockets.sockets[currentSocketId].removeListener('getChat', chat);
		this.database();
	}

	database() {
		// Escribir en la base de datos el dinero nuevo.
		// Idea: Solo escribir en la base de datos cuando el usuario se descoencta / se va.
		// Para esto se tendria que llevar el dinero de cada jugador en algun otro lado.
	}

	// Funciones auxiliares.

	checkCounters(object, maximumPlayers) {
		if (++object.counter < maximumPlayers) {
			if (++object.turn >= maximumPlayers) {
				object.turn = 0;
			}
			return true;
		}
		else {
			return false;
		}
	}

	dealCard(remove) {
		var random = Math.floor(Math.random() * this.deck.length);
		var card = this.deck[random];
		if (remove) {
			this.deck.splice(this.deck.indexOf(card), 1);
		}
		return card;
	}

	randomColor() {
		if (Math.random() > 0.5) {
			return true;
		}
		else {
			return false;
		}
	}
}

module.exports = {
    create: function (){
        return new Table();
    }
}