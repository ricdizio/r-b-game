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
    }
}

class Table {
    constructor(players, socketRoom){
        this.players = this.getIds(players);
        this.socketRoom = socketRoom;
        this.betTurn = 0;
        this.playTurn = 0;
        this.maximumPlayers = 2;

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
        this.bet();
    }

    bet(){
        var currentSocketId = this.players[this.betTurn];

        io.sockets.sockets[currentSocketId].on('getBet', function(money){
            // Revisar el dinero de currentSocket.
            console.log(money);
            io.sockets.to(this.socketRoom).emit('bettedMoney', money, this.betTurn);
            if((this.betTurn + 1) != this.maximumPlayers){
                this.betTurn++;
                start();
            }
            else{
                this.betTurn = 0;
                this.chooseColor();
            }
            
        });
 
        io.sockets.to(this.socketRoom).emit('bet', currentSocketId);
    }

    chooseColor(){
        io.sockets.to(this.socketRoom).emit('colores');
    }

    nextTurn(){
        this.playTurn++;
    }
}


function newConnection(socket){
    socket.on('join', function(room){
        socket.join(room);
        if(io.sockets.adapter.rooms[room].length == 2){
            setTimeout(function(){
                var table = new Table(io.sockets.adapter.rooms[room].sockets, room);
                table.start();
            }, 2000);
        }
    });

    socket.on('disconnect', function(){
    });

    socket.on('test', function(){
    });

    console.log("logeado");
}

console.log("Server on");




// io.sockets.to(chat.room).emit('message', {message: "details"});