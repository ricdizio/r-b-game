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


class Card {
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

class Table {
    constructor(players, socketRoom){
        this.players = this.getIds(players);
        this.socketRoom = socketRoom;
        this.betTurn = 0;
        this.playTurn = 0;
        this.pool = 0;
        this.maximumPlayers = 3;

        this.deck = new Array();
        this.generateDeck();
    }

    getIds(players){
        var temporalIds = new Array();
        for (var property in players) {
            if (players.hasOwnProperty(property)) {
                temporalIds.push(property);
            }
        }
        return temporalIds;
    }

    generateDeck(){
        for(var i = 0; i < decks; i++){
            for(var j = 0; j < suits.length; j++){
                for(var k = 0; k < numbers.length; k++){
                    this.deck.push(new Card(k + 1, numbers[k], suits[j]));
                }
            }
        }
    }

    dealCard(){
        var random = Math.floor(Math.random() * this.deck.length);
        var card = this.deck[random];
        this.deck.splice(deck.indexOf(card), 1);
        return card;
    }

    start(){
        var betCounter = 0;
        this.bet(this.betTurn, this.maximumPlayers, this.socketRoom, betCounter);
    }

    chooseColor(){
        var previousBetTurn = this.betTurn;

        if(++this.betTurn >= this.maximumPlayers){
            this.betTurn = 0;
        }

        var playCounter = 0;
        var colorBets = new Array();
        this.play(previousBetTurn, this.maximumPlayers, this.socketRoom, playCounter, colorBets);
    }

    reward(colorBets){
        var card = this.dealCard();
        var counter = 0;

        io.sockets.to(this.socketRoom).emit('deal', card);

        for(var i = 0; i < this.maximumPlayers; i++){
            if(colorBets[i] == card.color){
                counter++;
            }
        }
        var prize = this.pool / counter;

        if(counter == 0){
            io.sockets.to(this.socketRoom).emit('reward', 0, 0, true);
        }
        else{
            for(var i = 0; i < this.maximumPlayers; i++){
                if(colorBets[i] == card.color){
                    io.sockets.to(this.socketRoom).emit('reward', i, prize, false);
                }
            }
        }

        this.start();
    }

    bet(turn, maximumPlayers, socketRoom, betCounter){
        var self = this;
        var currentSocketId = this.players[turn];

        io.sockets.sockets[currentSocketId].on('getBet', betFunction);

        function betFunction(money){
            io.sockets.sockets[currentSocketId].removeListener('getBet', betFunction);
            io.sockets.to(socketRoom).emit('bettedMoney', money, turn);

            if(++betCounter < maximumPlayers){
                if(++turn >= maximumPlayers){
                    turn = 0;
                }
                self.bet(turn, maximumPlayers, socketRoom, betCounter);
            }
            else{
                self.chooseColor();
            }
        }

        io.sockets.to(socketRoom).emit('bet', currentSocketId, turn);
    }

    play(turn, maximumPlayers, socketRoom, playCounter, colorBets){
        var self = this;
        var currentSocketId = this.players[turn];

        io.sockets.sockets[currentSocketId].on('getPlay', playFunction);

        function playFunction(color){

            io.sockets.sockets[currentSocketId].removeListener('getPlay', playFunction);
            io.sockets.to(socketRoom).emit('bettedColor', color, turn);
            colorBets[turn] = color; // true: red, false: black.

            if(++playCounter < maximumPlayers){
                if(++turn >= maximumPlayers){
                    turn = 0;
                }
                self.play(turn, maximumPlayers, socketRoom, playCounter, colorBets);
            }
            else{
                self.reward(colorBets);
            }
        }

        io.sockets.to(socketRoom).emit('play', currentSocketId, turn);
    }

}



function newConnection(socket){
    socket.on('join', function(room){
        socket.join(room);
        if(io.sockets.adapter.rooms[room].length == 3){
            setTimeout(function(){
                var table = new Table(io.sockets.adapter.rooms[room].sockets, room);
                table.start();
            }, 1000);
        }
    });

    socket.on('disconnect', function(){
    });
}

console.log("Server on");




// io.sockets.to(chat.room).emit('message', {message: "details"});