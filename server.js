// socket.rooms // salas donde esta unido el socket.
// socket.rooms es un OBJETO. Los atributos son el nombre las salas, y contienen el nombre de la sala.
// io.sockets.adapter.rooms // salas creadas en el servidor.

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
var suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
var decks = 1;
var deck = new Array();
const players = 2;
const initialMoney = 5000;

class Card{
  constructor(value, number, suit){
    if(value < 10){
      this.value = value;
    }
    else{
      this.value = 10;
    }

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
  constructor(players, socketRoom, maximumPlayers, initialMoney){
    
    this.socketRoom = socketRoom;
    this.initialMoney = initialMoney;
    this.maximumPlayers = maximumPlayers;

    this.players = this.initiatePlayers(players, initialMoney);

    this.pool = 0;
    this.betTurn = 0;

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
    return temporalObjectArray;
  }

  generateDeck(){
    var temporalArray = new Array();
    for(var i = 0; i < decks; i++){
      for(var j = 0; j < suits.length; j++){
        for(var k = 0; k < numbers.length; k++){
          temporalArray.push(new Card(k + 1, numbers[k], suits[j]));
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
    this.deck = this.shuffle(this.deck);
    this.start();
  }

  start(){
    var betCounter = 0;
    this.pool = 0;
    this.bet(this.betTurn, betCounter);
  }

  chooseColor(){
    var previousBetTurn = this.betTurn;

    if(++this.betTurn >= this.maximumPlayers){
      this.betTurn = 0;
    }

    var playCounter = 0;
    this.play(previousBetTurn, playCounter);
  }

  reward(colorArray){
    var card = this.dealCard();
    var counter = 0;

    io.sockets.to(this.socketRoom).emit('deal', card);

    for(var i = 0; i < this.maximumPlayers; i++){
      if(colorArray[i] == card.color){
        counter++;
      }
    }

    if(counter == 0){
      io.sockets.to(this.socketRoom).emit('reward', 0, 0, true);
    }
    else{

      var prize = this.pool / counter;

      for(var i = 0; i < this.maximumPlayers; i++){
        if(colorArray[i] == card.color){
          this.players[i].add(prize);
          io.sockets.to(this.socketRoom).emit('reward', i, prize, false);
        }
      }
    }

    this.start();
  }

  bet(turn, betCounter){
    var self = this;
    var currentSocketId = this.players[turn].socketId;

    io.sockets.sockets[currentSocketId].on('getBet', betFunction);

    function betFunction(money){
      io.sockets.sockets[currentSocketId].removeListener('getBet', betFunction);
      io.sockets.to(self.socketRoom).emit('bettedMoney', money, turn);
      self.players[turn].substract(money);
      self.pool += money;

      if(++betCounter < self.maximumPlayers){
        if(++turn >= self.maximumPlayers){
          turn = 0;
        }
        self.bet(turn, betCounter);
      }
      else{
        self.chooseColor();
      }
    }

    io.sockets.to(self.socketRoom).emit('bet', currentSocketId, turn);
  }

  play(turn, playCounter){
    var self = this;
    var currentSocketId = this.players[turn].socketId;

    io.sockets.sockets[currentSocketId].on('getPlay', playFunction);

    function playFunction(color){

      io.sockets.sockets[currentSocketId].removeListener('getPlay', playFunction);
      io.sockets.to(self.socketRoom).emit('bettedColor', color, turn);
      self.colorBets[turn] = color; // true: red, false: black.

      if(++playCounter < self.maximumPlayers){
        if(++turn >= self.maximumPlayers){
          turn = 0;
        }
        self.play(turn, playCounter);
      }
      else{
        self.reward(self.colorBets);
      }
    }

    io.sockets.to(self.socketRoom).emit('play', currentSocketId, turn);
  }
}



function newConnection(socket){
  socket.on('join', function(room){
    socket.join(room);
    if(io.sockets.adapter.rooms[room].length == players){
      setTimeout(function(){
        var table = new Table(io.sockets.adapter.rooms[room].sockets, room, players, initialMoney);
        table.begin();
      }, 1000);
    }
  });

  socket.on('disconnect', function(){
  });
}

console.log("Server on");




// io.sockets.to(chat.room).emit('message', {message: "details"});