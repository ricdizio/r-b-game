var socket = io.connect('http://localhost:3000');
var bet = 0;

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


var red = document.getElementById('red');
var black = document.getElementById('black');
var bet = document.getElementById('bet');

red.addEventListener('click', sendRed);
black.addEventListener('click', sendBlack);
bet.addEventListener('click', sendBet);

function sendRed(){
    socket.emit('getPlay', true);
}

function sendBlack(){
    socket.emit('getPlay', false);
}

function sendBet(){
    socket.emit('getBet', money.value);
}



socket.on('bettedMoney', function(money, playerIndex){
    console.log("Jugador " + (playerIndex + 1) + " aposto " + money);
});

socket.on('bet', function(betId){
    if(betId == socket.id){
        console.log("Te toca apostar");
    }
});

socket.on('play', function(betId){
    if(betId == socket.id){
        console.log("Te toca elegir");
    }
});

socket.on('bettedColor', function(color, playerIndex){
    if(color){
        color = "rojo";
    }
    else{
        color = "negro";
    }

    console.log("Jugador " + (playerIndex + 1) + " eligio " + color);
    
});

socket.on('reward', function(playerIndex){
    console.log("Jugador " + (playerIndex + 1) + " gano.");
});

socket.emit('join', "room1");