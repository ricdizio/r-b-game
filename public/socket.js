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
  socket.emit('getBet', parseInt(money.value));
}

function logCard(card){
  console.log("Card: " + card.number + " of " + card.suit);
}

socket.on('bettedMoney', function(money, playerIndex){
  console.log("Jugador " + (playerIndex + 1) + " aposto " + money);
});

socket.on('bet', function(betId, playerIndex){
  if(betId == socket.id){
    console.log("Te toca apostar");
  }
  else{
    console.log("Jugador " + (playerIndex + 1) + " esta apostando");
  }
});

socket.on('play', function(betId, playerIndex){
  if(betId == socket.id){
    console.log("Te toca elegir");
  }
  else{
    console.log("Jugador " + (playerIndex + 1) + " esta eligiendo");
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

socket.on('deal', function(card){
  logCard(card);
});

socket.on('reward', function(playerIndex, prize, houseWon){
  if(!houseWon){
    console.log("Jugador " + (playerIndex + 1) + " gano " + prize);
  }
  else{
    console.log("Gana la casa");
  }
  
});

socket.on('timedOut', function(playerIndex){
  console.log('Jugador ' + (playerIndex + 1) + ' ha tardado demasiado');
});

socket.emit('join', "room1");