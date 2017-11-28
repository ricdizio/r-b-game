
var io = require('socket.io').listen(3000);
//var io = sails.io;
//var socket = req.socket;
io.sockets.on('connection', newConnection);
var table = new Array();
var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
var decks = 1;
var nickNum = 0;
var deck = new Array();
var playersArray = new Array();
const players = 3;
const maximumRounds = 5;
const initialMoney = 500;
const timeoutTime = 30000;
const timeBetweenRounds = 5000;
const constantBet = 100;
const poolTimeout = 30000;
const pickSuitTimeout = 10000;
const pickSuitDelay = 5000;
	    
	    class Card{
	      constructor(index, number, suit){
	        this.index = index;
	        this.number = number;
	        this.suit = suit;
	    
	        if(this.suit == "Hearts" || this.suit == "Diamonds"){
	          this.color = true;
	        }
	        else{
	          this.color = false;
	        }
	      }
	    }
	    
	    class Player{
	      constructor(socketId, money, playerIndex){
	        this.socketId = socketId;
	        this.money = money;
	        this.playerIndex = playerIndex;
	      }
	    
	      add(money){
	        this.money += money;
	      }
	    
	      substract(money){
	        this.money -= money;
	      }
	    }
	    
	    class Table{
	      constructor(player, socketRoom, maximumPlayers, maximumRounds, initialMoney, timeoutTime, constantMoneyBet){
					console.log('Se creo la mesa');
	        this.socketRoom = socketRoom;
	        this.initialMoney = initialMoney;
	        this.maximumPlayers = maximumPlayers;
	        this.maximumRounds = maximumRounds;
	        this.constantMoneyBet = constantMoneyBet;
	    
	        //this.players = this.initiatePlayers(players, initialMoney);
	    
	        this.players = new Array();
					this.addPlayer(player);
					//player es un ID.
					//players es un arreglo de IDS.
	    
	        this.suits = new Array();
	        this.pool = 0;
	        this.playTurn = 0;
	        this.round = 0;
	        this.readyAnswer = 0;
	        this.poolAccept = 0;
	        this.poolAnswer = 0;
	        this.timeoutTime = timeoutTime;
	        this.poolTimeoutVariable;
	        this.chooseFirstTimeoutVariable;
	    
	        this.deck = this.shuffle(this.generateDeck());
	        this.colorBets = new Array();
	      }
	    
	      addPlayer(player){
					var self = this;
					this.players.push(player);
					console.log('jugador añadido');

					io.sockets.sockets[player].on('ready', ready);
			
					function ready(socketId){
						io.sockets.sockets[socketId].removeListener('ready', ready);
						if(++self.readyAnswer == self.maximumPlayers){
							console.log('Iniciamos');
							self.readyAnswer = 0;
							self.chooseFirst();
						}
					}

	        if(this.players.length == this.maximumPlayers){
	          this.players = this.initiatePlayers(this.players, this.initialMoney);
						console.log('Esperando por los ready');
	        }
	      }
	    
	      initiatePlayers(playersId, initialMoney){
	        var temporalObjectArray = new Array();
	    
	        for(var i = 0; i < playersId.length; i++){
	          temporalObjectArray[i] = new Player(playersId[i], initialMoney, i);
	        }
	    
	        this.addChat(temporalObjectArray);
	    
	        return temporalObjectArray;
	      }
	    
	      addChat(players){
	        var self = this;
	        for(var i = 0; i < players.length; i++){
	          io.sockets.sockets[players[i].socketId].on('chat', chat);
	        }
	    
	        function chat(message){
	          io.sockets.to(self.socketRoom).emit('chat', message);
	        }
	      }
	      generateDeck(){
	        var temporalArray = new Array();
	        for(var i = 0; i < decks; i++){
	          for(var j = 0; j < numbers.length; j++){
	            for(var k = 0; k < suits.length; k++){
	              temporalArray.push(new Card(j*4 + k, numbers[j], suits[k]));
	            }
	          }
	        }
	        return temporalArray;
	      }
	    
	      dealCard(remove){
	        var random = Math.floor(Math.random() * this.deck.length);
	        var card = this.deck[random];
	        if(remove){
	          this.deck.splice(deck.indexOf(card), 1);
	        }
	        return card;
	      }
	    
	      shuffle(array){
	        var newArray = array;
	        var arrayLength = array.length;
	        var randomNumber;
	        var temp;
	    
	        while(arrayLength){
	          randomNumber = Math.floor(Math.random() * arrayLength--);
	          temp = newArray[arrayLength];
	          newArray[arrayLength] = newArray[randomNumber];
	          newArray[randomNumber] = temp;
	        }
	    
	        return newArray;
	      }
	    
	      begin(){
	        this.deck = this.shuffle(this.deck);
	      }
	    
	      waitReady(){
	      }
	    
	      chooseFirst(){
	        var self = this;
	        this.suits = new Array();
	        this.chooseFirstCounter = 0;
	        io.sockets.to(this.socketRoom).emit('suitRequest');
	        for(var i = 0; i < this.maximumPlayers; i++){ // Asignamos event listener a todos los usuarios.
	          io.sockets.sockets[this.players[i].socketId].on('suit', chooseFirstTurn);
	        }
	    
	        function chooseFirstTurn(suit, socketId){
	          io.sockets.sockets[socketId].removeListener('suit', chooseFirstTurn); // Quitamos el listener del usuario que eligio.
	          console.log('picked: '+suit);
	          for(var i = 0; i < self.maximumPlayers; i++){
	            if(self.players[i].socketId == socketId){ // Revisamos que jugador lo hizo y guardamos la pinta (suit) en ese espacio del arreglo self.suits.
	              self.suits[i] = suit;
	              break;
	            }
	          }
	    
	          io.sockets.to(self.socketRoom).emit('pickedSuit', suit); // Enviamos el arreglo con la pinta elegida por cada jugador. Mostrarlo en pantalla.
	          if(++self.chooseFirstCounter == self.maximumPlayers){ // Si ya todos eligieron, sacamos una carta y la enviamos al cliente.
	    
	            var validSuit = true;
	            while(validSuit){
	              var card = self.dealCard(false);
	              for(var i = 0; i < self.maximumPlayers; i++){ // Revisamos que jugador gano.
	                if(self.suits[i] == card.suit){
	                  self.playTurn = i; // Le decimos que el turno es el i. Tengo que revisar esto. Si comentas esta linea el va a arrancar en el jugador 1 siempre.
	                  validSuit = false;
	                  break;
	                }
	              }
	            }
	            io.sockets.to(self.socketRoom).emit('donePicking', card);  // Enviamos el socket con la pinta de la carta.
	            var setTime = setTimeout(function(){  // En ciertos segundos inicia la partida normalmente. 
	              self.start();
	            }, pickSuitDelay);
	          }
	    
	          
	        }
	      }
	    
	      start(){
	        if(this.round < this.maximumRounds){
	          io.sockets.to(this.socketRoom).emit('round', ++this.round);
	          var betCounter = 0;
	    
	          this.constantBet();
	          
	        }
	        else{
	          this.end();
	        }
	      }
	    
	      
	    
	      constantBet(){
	        //this.pool = 0; // Ahora se hace en sendreward.
	        var temporalArray = new Array();
	        for(var i = 0; i < this.maximumPlayers; i++){
	          this.players[i].substract(this.constantMoneyBet);
	          temporalArray.push(this.players[i].money);
	          this.pool += this.constantMoneyBet;
	        }
	    
	        io.sockets.to(this.socketRoom).emit('substractConstantBet', temporalArray);
	        this.chooseColor();
	      }
	    
	      chooseColor(){
	        var previousBetTurn = this.playTurn;
	    
	        if(++this.playTurn >= this.maximumPlayers){
	          this.playTurn = 0;
	        }
	    
	        this.play(previousBetTurn, 0);
	      }
	    
	      bet(turn, betCounter){
	        var self = this;
	        var currentSocketId = this.players[turn].socketId;
	    
	        io.sockets.sockets[currentSocketId].on('getBet', betFunction);
	    
	        function betFunction(money){
	          clearTimeout(setTime);
	          io.sockets.sockets[currentSocketId].removeListener('getBet', betFunction);
	          io.sockets.to(self.socketRoom).emit('bettedMoney', money, turn);
	          self.players[turn].substract(money);
	          self.pool += money;
	    
	          var temporalObject = {
	            counter: betCounter,
	            turn: turn
	          }
	    
	          if(self.checkCounters(temporalObject, self.maximumPlayers)){
	            self.bet(temporalObject.turn, temporalObject.counter);
	          }
	          else{
	            self.chooseColor();
	          }
	        }
	    
	        io.sockets.to(this.socketRoom).emit('bet', currentSocketId, turn);
	        
	        var setTime = setTimeout(function(){
	          io.sockets.sockets[currentSocketId].removeListener('getBet', betFunction);
	          io.sockets.to(self.socketRoom).emit('timedOut', turn);
	          
	          var temporalObject = {
	            counter: betCounter,
	            turn: turn
	          }
	    
	          if(self.checkCounters(temporalObject, self.maximumPlayers)){
	            self.bet(temporalObject.turn, temporalObject.counter);
	          }
	          else{
	            self.chooseColor();
	          }
	        }, this.timeoutTime);
	      }
	    
	      play(turn, playCounter){
	        var self = this;
	        var currentSocketId = this.players[turn].socketId;
	    
	        io.sockets.sockets[currentSocketId].on('getPlay', playFunction);
	    
	        function playFunction(color){
	          clearTimeout(setTime);
	          io.sockets.sockets[currentSocketId].removeListener('getPlay', playFunction);
	          io.sockets.to(self.socketRoom).emit('bettedColor', color, turn);
	          self.colorBets[turn] = color; // true: red, false: black.
	    
	          var temporalObject = {
	            counter: playCounter,
	            turn: turn
	          }
	    
	          if(self.checkCounters(temporalObject, self.maximumPlayers)){
	            self.play(temporalObject.turn, temporalObject.counter);
	          }
	          else{
	            //io.sockets.to(self.socketRoom).emit('play', currentSocketId, ++turn, true);
	            self.reward(self.colorBets);
	          }
	        }
	        //io.sockets.to(self.socketRoom).emit('play', currentSocketId, turn, false);
	        io.sockets.to(self.socketRoom).emit('play', currentSocketId, turn);
	    
	        var setTime = setTimeout(function(){
	          var randomPick = self.randomColor();
	          io.sockets.sockets[currentSocketId].removeListener('getPlay', playFunction);
	          io.sockets.to(self.socketRoom).emit('bettedColor', randomPick, turn);
	          io.sockets.to(self.socketRoom).emit('timedOut', turn);
	          self.colorBets[turn] = randomPick; // true: red, false: black.
	    
	          var temporalObject = {
	            counter: playCounter,
	            turn: turn
	          }
	    
	          if(self.checkCounters(temporalObject, self.maximumPlayers)){ // Dentro de checkcounters es que se suman los contadores.
	            self.play(temporalObject.turn, temporalObject.counter);
	          }
	          else{
	            self.reward(self.colorBets);
	          }
	        }, this.timeoutTime);
	      }
	      reward(colorArray){
	        var card = this.dealCard(true);
	        var counter = 0;
	        var self = this;
	        var balance = new Array();
	    
	        io.sockets.to(this.socketRoom).emit('deal', card);
	    
	        for(var i = 0; i < this.maximumPlayers; i++){
	          if(colorArray[i] == card.color){
	            counter++;
	          }
	        }
	        if(counter == 0){
	          // House won.
	          for(var i = 0; i < this.maximumPlayers; i++){
	            balance.push(this.players[i].money);
	          }
	          io.sockets.to(this.socketRoom).emit('reward', 0, 0, balance, 0, true);
	          this.pool = 0;
	          this.sendReward(0, 0, false, 0, 0);
	        }
	        else if(counter == this.maximumPlayers){
	    
	          this.poolTimeoutVariable = setTimeout(function(){
	            poolAnswer(false, 0);
	          }, poolTimeout);
	    
	          this.poolAnswer = 0;
	    
	          for(var i = 0; i < this.maximumPlayers; i++){
	            io.sockets.sockets[this.players[i].socketId].on('getPoolAnswer', poolAnswer);//respuesta pool
	          }
	    
	          io.sockets.to(this.socketRoom).emit('poolRequest');// solicitud para acumular
	    
	          function poolAnswer(poolAnswerVar, socketId){
	            /*if(poolAnswerVar){
	              console.log('yes al pool');
	              self.poolAnswer++;
	              io.sockets.sockets[socketId].removeListener('getPoolAnswer', poolAnswer);
	              if(++self.poolAccept == self.maximumPlayers){ // Si todos dicen que si.
	                console.log('todos si');
	                self.sendReward(0, 0, false, 0, 0);
	              }
	            }
	            else if(++self.poolAnswer == self.maximumPlayers){ // Si uno se niega.
	              for(var i = 0; i < self.maximumPlayers; i++){ // Si alguien dice que no, quitamos los event listeners de todos y les hacemos reward.
	                io.sockets.sockets[self.players[i].socketId].removeListener('getPoolAnswer', poolAnswer);
	              }
	              self.sendReward(colorArray, counter, true, card, balance);
	            }*/
	    
	            if(poolAnswerVar){
	              self.poolAccept++;
	            }
	            self.poolAnswer++;
	    
	            if(self.poolAccept == self.maximumPlayers){ // Si todos dicen que si.
	              console.log('todos si');
	              self.sendReward(0, 0, false, 0, 0);
	            }
	            else if(self.poolAnswer == self.maximumPlayers){
	              console.log('Pool Negado');
	              for(var i = 0; i < self.maximumPlayers; i++){ // Si alguien dice que no, quitamos los event listeners de todos y les hacemos reward.
	                io.sockets.sockets[self.players[i].socketId].removeListener('getPoolAnswer', poolAnswer);
	              }
	              self.sendReward(colorArray, counter, true, card, balance);
	            }
	    
	          }
	    
	        }
	        else{
	          this.sendReward(colorArray, counter, true, card, balance);
	        }
	      }
	    
	      sendReward(colorArray, counter, go, card, balance){
	        clearTimeout(this.poolTimeoutVariable);
	        var self = this;
	        if(go){
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
	          io.sockets.to(this.socketRoom).emit('reward', winningPlayers, prize, balance, ids, false);
	        }
	    
	        console.log('pool luego de sendreward: ' + this.pool);
	    
	        setTimeout(function(){
	          self.start();
	        }, timeBetweenRounds);
	      }
	    
	      checkCounters(object, maximumPlayers){
	        if(++object.counter < maximumPlayers){
	            if(++object.turn >= maximumPlayers){
	              object.turn = 0;
	            }
	            return true;
	          }
	          else{
	            return false;
	          }
	      }
	    
	      end(){
	        console.log('Game Over');
	        tables.splice(tables.indexOf(this), 1);
	        io.sockets.to(this.socketRoom).emit('tableEnd');
	    
	        io.sockets.adapter.rooms[this.socketRoom].started == false;
	        // Remover listeners de chat
	        // io.sockets.sockets[currentSocketId].removeListener('getChat', chat);
	        this.database();
	      }
	    
	      database(){
	        // Escribir en la base de datos el dinero nuevo.
	        // Idea: Solo escribir en la base de datos cuando el usuario se descoencta / se va.
	        // Para esto se tendria que llevar el dinero de cada jugador en algun otro lado.
	      }
	    
	      randomColor(){
	        if(Math.random() > 0.5){
	          return true;
	        }
	        else{
	          return false;
	        }
	      }
	    }
	    
	    function newConnection(socket){
	      socket.on('join', function(room, roomCapacity){
	        socket.join(room);
					console.log('Esto es table0: ' + table[0]);
					playGame.nickName(nickNum++);
	        if(table[0]){
	          table[1].addPlayer(socket.id);
	          console.log(socket.id + ' added');
	        }
	        else{
	          //io.sockets.adapter.rooms[room].sockets
	          table[0] = true;
	          table[1] = new Table(socket.id, room, 
	            players, maximumRounds, initialMoney, timeoutTime, constantBet);
	          table[1].begin();
	          console.log('Table created');
	          console.log(socket.id + ' added');
	        }
	      });
	    
	      socket.emit('menu');
	      socket.on('disconnect', function(){
	      });
	    }

console.log("Se ejecuto");

module.exports = {
	socket : io.sockets,
	playersArray : playersArray
}