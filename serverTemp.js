// socket.rooms // salas donde esta unido el socket.
// socket.rooms es un OBJETO. Los atributos son el nombre las salas, y contienen el nombre de la sala.
// io.sockets.adapter.rooms // salas creadas en el servidor.

// Cuidado: chequear siempre el socket.id antes de hacer algo con el, si no existe el server crashea. Esto aplica para las funciones que envien desde el cliente el socket.id

/* Optimizaciones: 
No mandar el socket id desde el cliente. Usar algun atributo que probablemente tenga socket.io
Evitar usar self = this. Esto copiara toda la clase y no se utiliza toda, tratar de copiar solo lo necesario.
*/

// Socket and server settings.
const express = require('express');
const socketIO = require('socket.io');
//const HashMap = require('hashmap');

var app = express();

var server = app.listen(3000);
var io = socketIO(server);
//var map = new HashMap();

app.use(express.static('public'));

io.sockets.on('connection', newConnection);


var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
var decks = 1;
var deck = new Array();
var tables = new Array();
const players = 3;
const maximumRounds = 5;
const initialMoney = 500;
const timeoutTime = 30000;
const timeBetweenRounds = 5000;
const constantBet = 100;
const poolTimeout = 15000;


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
  constructor(players, socketRoom, maximumPlayers, maximumRounds, initialMoney, timeoutTime, constantMoneyBet){

    this.socketRoom = socketRoom;
    this.initialMoney = initialMoney;
    this.maximumPlayers = maximumPlayers;
    this.maximumRounds = maximumRounds;
    this.constantMoneyBet = constantMoneyBet;

    this.players = this.initiatePlayers(players, initialMoney);
    this.suits = new Array();
    this.pool = 0;
    this.playTurn = 0;
    this.round = 0;
    this.poolAnswer = 0;
    this.timeoutTime = timeoutTime;

    this.deck = this.shuffle(this.generateDeck());
    this.colorBets = new Array();
  }

  initiatePlayers(players, initialMoney){
    var temporalIds = new Array();
    var temporalObjectArray = new Array();

    for (var property in players){
      if (players.hasOwnProperty(property)){
        temporalIds.push(property);
      }
    }
    for(var i = 0; i < temporalIds.length; i++){
      temporalObjectArray[i] = new Player(temporalIds[i], initialMoney, i);
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

  dealCard(){
    var random = Math.floor(Math.random() * this.deck.length);
    var card = this.deck[random];
    this.deck.splice(deck.indexOf(card), 1);
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
    var self = this;
    this.deck = this.shuffle(this.deck);
    
    setTimeout(function(){
      self.start();
    }, 10000);
  }

  start(){
    if(this.round < this.maximumRounds){
      io.sockets.to(this.socketRoom).emit('round', ++this.round);
      var betCounter = 0;

      //this.constantBet();
      this.chooseFirst();
    }
    else{
      this.end();
    }
  }

  chooseFirst(){
    this.suits = new Array();
    var self = this;

    for(var i = 0; i < this.maximumPlayers; i++){
      io.sockets.sockets[this.players[i].socketId].on('suit', chooseFirstTurn);
    }

    function chooseFirstTurn(suit, socketId){
      io.sockets.sockets[socketId].removeListener('suit', chooseFirstTurn);

      for(var i = 0; i < self.maximumPlayers; i++){
        if(self.players[i].socketId == socketId){
          self.suits[i] = suit;
        }
        
      }
      io.sockets.to(self.socketRoom).emit('pickedSuit', self.suits);
    }

  }

  constantBet(){
    //this.pool = 0; // Ahora se hace en sendreward.
    for(var i = 0; i < this.maximumPlayers; i++){
      this.players[i].substract(this.constantMoneyBet);
      this.pool += this.constantMoneyBet;
    }
    io.sockets.to(this.socketRoom).emit('substractConstantBet', this.constantMoneyBet);
    this.chooseColor();
  }

  chooseColor(){
    var previousBetTurn = this.playTurn;

    if(++this.playTurn >= this.maximumPlayers){
      this.playTurn = 0;
    }

    var playCounter = 0;
    this.play(previousBetTurn, playCounter);
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
    var card = this.dealCard();
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
    }
    else if(counter == this.maximumPlayers){

      var poolTimeoutVariable = setTimeout(function(){
        poolAnswer(false, 0);
      }, poolTimeout);

      this.poolAnswer = 0;

      for(var i = 0; i < this.maximumPlayers; i++){
        io.sockets.sockets[this.players[i].socketId].on('getPoolAnswer', poolAnswer);
      }

      io.sockets.to(this.socketRoom).emit('confirmPool');

      function poolAnswer(poolAnswerVar, socketId){
        if(poolAnswerVar){
          io.sockets.sockets[socketId].removeListener('getPoolAnswer', playFunction);
          if(++this.poolAnswer == this.maximumPlayers){ // Si todos dicen que si.
            this.sendReward(0, 0, false, 0, 0);
          }
        }
        else{ // Si uno se niega.
          for(var i = 0; i < this.maximumPlayers; i++){ // Si alguien dice que no, quitamos los event listeners de todos y les hacemos reward.
            io.sockets.sockets[this.players[i].socketId].removeListener('getPoolAnswer', playFunction);
          }
          this.sendReward(colorArray, counter, true, card, balance);
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
    if(io.sockets.adapter.rooms[room].length == roomCapacity){
      var table = new Table(io.sockets.adapter.rooms[room].sockets, room, 
        players, maximumRounds, initialMoney, timeoutTime, constantBet);
      tables.push(table);
      table.begin();
    }
  });

  socket.emit('menu');
  socket.on('disconnect', function(){
  });
}

console.log("Server on");




// io.sockets.to(chat.room).emit('message', {message: "details"});