// socket.rooms // salas donde esta unido el socket.
// socket.rooms es un OBJETO. Los atributos son el nombre las salas, y contienen el nombre de la sala.
// io.sockets.adapter.rooms // salas creadas en el servidor.

// Cuidado: chequear siempre el socket.id antes de hacer algo con el, si no existe el server crashea. Esto aplica para las funciones que envien desde el cliente el socket.id

/* Optimizaciones: 
No mandar el socket id desde el cliente. Usar algun atributo que probablemente tenga socket.io
Evitar usar self = this. Esto copiara toda la clase y no se utiliza toda, tratar de copiar solo lo necesario.
*/

var io = require('socket.io').listen(3000);
const HashMap = require('hashmap');

// Variables globales
var hashMap = new HashMap();
var waitingRoomVar = 0;
var globalTable;

var newPlayersArray = new Array();
var nickNamesArray = new Array();
var globalDeck = generateDeck();

io.sockets.on('connection', newConnection);
var table = new Array();
var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
var decks = 1;

const playTimeoutTime = 30000;
const timeBetweenRounds = 5000;
const poolTimeout = 30000;

class Card {
	constructor(index, number, suit) {
		this.index = index;
		this.number = number;
		this.suit = suit;

		if (number == 'A') {
			this.value = 11;
		}
		else {
			this.value = parseInt(number);
		}

		if (this.suit == "Hearts" || this.suit == "Diamonds") {
			this.color = true;
		}
		else {
			this.color = false;
		}
	}
}

class Player {
	constructor(socketId, nickName) {
		this.socketId = socketId;
		this.nickName = nickName;
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

class Table {
	constructor(Players, socketRoom, type, maximumPlayers, maximumRounds, initialMoney, playTimeoutTime, constantMoneyBet) {
		this.socketRoom = socketRoom;
		this.type = type;
		this.maximumPlayers = maximumPlayers;
		console.log('MAXIMUN PLAYERS ' + maximumPlayers)
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

class WaitingRoom {
	constructor(roomName, deck) {
		// Room and default settings
		this.roomName = roomName;
		this.type = 0; // 0 normal. 1 vip
		this.lock = 0; // 0 privado, 1 publico
		this.roomPassword = '';
		this.roomBet = 100;
		this.roomCapacity = 3;
		this.turnTime = 30000;
		this.rounds = 5;
		this.roomCreator;
		this.nickNamesArray = new Array();
		this.pickedCards = new Array();
		this.players = new Array();
		this.deck = this.shuffle(this.shuffle(deck));

		this.dealtCounter = 0;
	}

	addPlayer(Player) {
		var self = this;

		// Solo el primer jugador puede iniciar el juego.
		// Añadir control del boton de empezar cuando la sala este llena y todos con carta elegida.

		if (this.players.length == 0) {
			this.roomCreator = Player;
			// falta nombre
			io.sockets.sockets[Player.socketId].on('updateType', updateType);
			io.sockets.sockets[Player.socketId].on('updateLock', updateLock);
			io.sockets.sockets[Player.socketId].on('updatePassword', updatePassword);
			io.sockets.sockets[Player.socketId].on('updateBet', updateBet);
			io.sockets.sockets[Player.socketId].on('updateCapacity', updateCapacity);
			io.sockets.sockets[Player.socketId].on('updateTurnTime', updateTurnTime);
			io.sockets.sockets[Player.socketId].on('updateRounds', updateRounds);
		}

		this.players.push(Player);
		this.nickNamesArray.push(Player.nickName);

		io.sockets.sockets[Player.socketId].on('chat', chat);
		io.sockets.sockets[Player.socketId].on('dealWaitingRoomCard', chooseFirst);

		function chat(message, socketId) {
			var filterObj = self.players.filter(function(e) {
				return e.socketId == socketId;
			});
			var nickName = filterObj[0].nickName;
			io.sockets.to(self.roomName).emit('chat', nickName, message);
		}

		function chooseFirst(socketId) {
			io.sockets.sockets[socketId].removeListener('dealWaitingRoomCard', chooseFirst);
			var tempCard = self.dealCard(true);

			/*for (var i = 0; i < self.players.length; i++) {
				if (self.players[i].socketId == socketId) {
					break;
				}
			}*/

			var filterObj = self.players.filter(function(e) {
				return e.socketId == socketId;
			});

			var i = self.players.indexOf(filterObj[0]);

			self.pickedCards[i] = tempCard;
			io.sockets.to(self.roomName).emit('waitingRoomDealt', tempCard, i, socketId); // Envia la carta y el jugador (i manda la posicion)

			// PROBLEMA FUTURO: si se eligen todas las cartas y el master cambia la capacidad de la sala.
			if (++self.dealtCounter == self.roomCapacity) {
				//self.sortPlayers();
				io.sockets.sockets[self.roomCreator.socketId].on('startTable', function () {
					io.sockets.sockets[self.roomCreator.socketId].removeListener('updateType', updateType);
					io.sockets.sockets[self.roomCreator.socketId].removeListener('updatePassword', updatePassword);
					io.sockets.sockets[self.roomCreator.socketId].removeListener('updateBet', updateBet);
					io.sockets.sockets[self.roomCreator.socketId].removeListener('updateCapacity', updateCapacity);
					io.sockets.sockets[self.roomCreator.socketId].removeListener('updateTurnTime', updateTurnTime);
					io.sockets.sockets[self.roomCreator.socketId].removeListener('updateRounds', updateRounds);

					for (var i = 0; i < self.players.length; i++) {
						io.sockets.sockets[self.players[i].socketId].emit('logicalPlayers', self.nickNamesArray, self.players[i].nickName);
						console.log('Enviando: ' + self.players[i].nickName + ' ' + self.nickNamesArray);
					}

					io.sockets.to(self.roomName).emit('tableStarted', 0, self.roomCapacity, self.rounds, self.turnTime, 0, self.roomBet * self.rounds);
					console.log('JUGADORES AL CREAR: ')
					console.log(self.players)
					globalTable = new Table(self.players, self.roomName, self.type,
						self.roomCapacity, self.rounds, self.roomBet * self.rounds, self.turnTime, self.roomBet);
				});

				io.sockets.sockets[self.roomCreator.socketId].emit('startTableEnabled');
			}
		}

		function updateType(type) {
			self.type = type;
			io.sockets.to(self.roomName).emit('waitingRoomType', type);
		}

		function updateLock(lock){
			self.lock = lock;
			io.sockets.to(self.roomName).emit('waitingRoomLock', lock);
		}

		function updatePassword(password) {
			self.password = password;
		}

		function updateBet(bet) {
			self.bet = bet;
			io.sockets.to(self.roomName).emit('waitingRoomBet', bet);
		}

		function updateCapacity(capacity) {
			console.log('CAPACIDAD RECIBIDA: ' + capacity);
			self.roomCapacity = capacity;
			io.sockets.to(self.roomName).emit('waitingRoomCapacity', capacity);
		}

		function updateTurnTime(turnTime) {
			console.log('TURNO RECIBIDA: ' + turnTime);
			self.turnTime = turnTime;
			io.sockets.to(self.roomName).emit('waitingRoomTurnTime', turnTime);
		}

		function updateRounds(rounds) {
			console.log('RONDAS RECIBIDA: ' + rounds);
			self.rounds = rounds;
			io.sockets.to(self.roomName).emit('waitingRoomRounds', rounds);
		}

		io.sockets.to(this.roomName).emit('waitingRoomJoin', this.players); //enviamos el arreglo de PLAYERS (clase)
	}

	kickPlayer(Player) {
		var index = this.players.indexOf(Player);
		io.sockets.to(this.roomName).emit('waitingRoomLeft', index, this.players[index].socketId); //enviamos el arreglo de PLAYERS (clase)
		this.players.splice(index, 1);
		this.pickedCards.splice(index, 1);
		//this.dealtCounter--;

	}

	sortPlayers() {
		var tempObject = {};
		for (var i = 0; i < this.roomCapacity; i++) {
			this.pickedCards[i] = [this.pickedCards[i].value, this.players[i]];
		}

		this.pickedCards.sort(function (a, b) { return b[0] - a[0] });

		for (var i = 0; i < this.roomCapacity; i++) {
			this.players[i] = this.pickedCards[i][1];
		}
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

	dealCard(remove) {
		var random = Math.floor(Math.random() * this.deck.length);
		var card = this.deck[random];
		if (remove) {
			this.deck.splice(this.deck.indexOf(card), 1);
		}
		return card;
	}
}

function newConnection(socket) {
	console.log('Nick actual: ');
	console.log(nickNamesArray[nickNamesArray.length - 1]);
	console.log('socket id');
	console.log(socket.id);
	socket.join('lobby');

	newPlayersArray.push(new Player(socket.id, nickNamesArray[nickNamesArray.length - 1]));

	socket.on('join', function (roomName) {
		console.log('socket id en join');
		console.log(socket.id);
		// Incluir revision de capacidad de la sala.
		for (var i = 0; i < newPlayersArray.length; i++) {
			if (newPlayersArray[i].socketId == socket.id) {
				var Me = newPlayersArray[i];
				console.log(Me);
				break;
			}
		}
		socket.leave('lobby');
		socket.join(roomName);

		socket.on('leaveWaitingRoom', function () {
			for (var i = 0; i < newPlayersArray.length; i++) {
				if (newPlayersArray[i].socketId == socket.id) {
					var Me = newPlayersArray[i];
					break;
				}
			}
			waitingRoomVar.kickPlayer(Me);
			socket.join('lobby');
		});

		if (waitingRoomVar == 0) {
			waitingRoomVar = new WaitingRoom(roomName, globalDeck);

			var temp = {
				roomName: roomName,
				type: 0, // 0 normal. 1 vip
				lock: 0, // 0 privado, 1 publico b
				roomPassword: '',
				roomBet: 100,
				roomCapacity: 3,
				turnTime: 30000,
				rounds: 5
			}

			io.sockets.to('lobby').emit('refreshRooms', temp);

			waitingRoomVar.addPlayer(Me);
		}
		else {
			waitingRoomVar.addPlayer(Me);
		}
		
	});

	socket.on('disconnect', function () {
	});

}

function generateDeck() {
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

console.log("Se ejecuto");

module.exports = {
	socket: io.sockets,
	addNick: function (nickName) {
		nickNamesArray.push(nickName);
		console.log('nickNamesArray');
		console.log(nickNamesArray);
	},
	hashMap: hashMap
}