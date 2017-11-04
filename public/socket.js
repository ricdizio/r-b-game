var socket = io.connect('http://localhost:3000');
var bet = 0;

class Card {
  constructor(index, number, suit){
    this.index = index;
    this.number = number;
    this.suit = suit;
  }
}

var red = document.getElementById('red');
var black = document.getElementById('black');
var bet = document.getElementById('bet');
var currentTurn = 0;

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
  playGame.flipCard(card);
  console.log("Card: " + card.number + " of " + card.suit);
}

socket.on('bettedMoney', function(money, playerIndex){
  console.log("Jugador " + (playerIndex + 1) + " aposto " + money);
});

socket.on('bet', function(betId, playerIndex){
  if(betId == socket.id){
    console.log("Te toca apostar");
    // Colocar en pantalla "te toca apostar"
  }
  else{
    console.log("Jugador " + (playerIndex + 1) + " esta apostando");
    //Colocar en pantalla "jugador playerindex+1 esta apostando"
  }
});

socket.on('play', function(betId, playerIndex, lastTurn){
  //if(!lastTurn){
    if(betId == socket.id){
      console.log("Te toca elegir");
      // Colocar en pantalla "te toca elegir"
    }
    else{
      console.log("Jugador " + (playerIndex + 1) + " esta eligiendo");
      // Colocar en pantalla "jugador playerindex+1 esta eligiendo"
    }
    currentTurn = playerIndex;
    playGame.alertTurn(playerIndex);
  //}
  //else{
  //  playGame.checkPlayer(playerIndex);
  //}
  
});

socket.on('bettedColor', function(color, playerIndex){
  if(color){
    color = "rojo";
  }
  else{
    color = "negro";
  }
  // Aqui podemos poner en pantalla que eligio cada jugador (playerindex y color)
  playGame.checkPlayer(playerIndex);
  console.log("Jugador " + (playerIndex + 1) + " eligio " + color);
});

socket.on('deal', function(card){
  logCard(card);
});

socket.on('reward', function(playerIndex, prize, houseWon){
  if(!houseWon){
    // Aqui sabemos que jugador gano (playerindex) y cuanto gano (prize)
    console.log("Jugador " + (playerIndex + 1) + " gano " + prize);
  }
  else{
    // Mostrar en pantalla que gano la casa.
    console.log("Gana la casa");
  }
  
});

socket.on('timedOut', function(playerIndex){
  // Aqui indica que el jugador playerIndex tardo demasiado y su turno fue pasado.
  console.log('Jugador ' + (playerIndex + 1) + ' ha tardado demasiado');
});

socket.emit('join', "room1");

