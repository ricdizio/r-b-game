var socket = io.connect('http://200.84.44.5:3000');
var bet = 0;

class Card {
  constructor(index, number, suit){
    this.index = index;
    this.number = number;
    this.suit = suit;
  }
}

var currentTurn = 0;


function sendBet(){
  socket.emit('getBet', parseInt(money.value));
}

function logCard(card){
  playGame.showCard(card);
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

socket.on('suitRequest', function(){
  playGame.suitRequest();
});

socket.on('pickedSuit', function(suit){
  if(suit == 'Clubs')
    playGame.pickedSuit(0);
  if(suit == 'Spades')
    playGame.pickedSuit(1);
  if(suit == 'Hearts')
    playGame.pickedSuit(2);
  if(suit == 'Diamonds')
    playGame.pickedSuit(3);
});

socket.on('donePicking', function(card){
  console.log('Done Picking');
  playGame.showFirst(card);
});

socket.on('play', function(betId, playerIndex, playTimer, nickName){
  //if(!lastTurn){
    if(betId == socket.id){
      console.log("Te toca elegir!");
      playGame.alertTurn(true, playerIndex, '¡Te toca elegir!', playTimer);
      // Colocar en pantalla "te toca elegir"
    }
    else{
      console.log(nickName+ " esta eligiendo!");
      playGame.alertTurn(false, playerIndex, nickName + " esta eligiendo!", playTimer);
      // Colocar en pantalla "jugador playerindex+1 esta eligiendo"
    }
    currentTurn = playerIndex;
  //}
  //else{
  //  playGame.checkPlayer(playerIndex);
  //}
  
});

socket.on('bettedColor', function(color, playerIndex){
  if(color){
    color = "Red";
  }
  else{
    color = "Black";
  }
  // Aqui podemos poner en pantalla que eligio cada jugador (playerindex y color)
  playGame.checkPlayer(playerIndex, color);
  console.log("Jugador " + (playerIndex + 1) + " eligio " + color);
});

socket.on('deal', function(card){
  logCard(card);
});

socket.on('reward', function(winningPlayers, prize, balance, ids, houseWon){
  console.log('premio: ' + prize);
  var winText = new String();
  if(!houseWon){
    // winningPlayers es un arreglo con los playerIndex de los ganadores (0, 1, etc).
    // balance contiene el dinero de cada jugador (del 0 a N jugadores).
    for(var i = 0; i < winningPlayers.length; i++){
      if(ids[winningPlayers[i]] == socket.id){
        winText = 'You Win ';
        console.log('You win ' + prize +'!');
        break;
      }
      else{
        winText = 'You Lose';
        prize = 0;
        console.log('You Lose ');
      }
    }
  }
  else{
    // Mostrar en pantalla que gano la casa.
    console.log("Gana la casa");
    winText = 'The House Wins';
    prize =0;
  }
  for(var i = 0; i < balance.length; i++){
      console.log("Jugador " + (i+1) + " tiene " + balance[i]);
  }
  playGame.updateWinners(winText, prize);
  playGame.updateBalane(balance);
});

socket.on('poolRequest', function(){
  playGame.poolRequest(true);
});

socket.on('round', function(round){
  // Aqui actualiza la ronda abajo a la izq.
  playGame.updateRound(round);
  console.log("Round " + (round));
});

socket.on('timedOut', function(playerIndex){
  // Aqui indica que el jugador playerIndex tardo demasiado y su turno fue pasado.
  console.log('Jugador ' + (playerIndex + 1) + ' ha tardado demasiado');
});

socket.on('substractConstantBet', function(balance){
  playGame.updateBalane(balance);
  // Actualizar el dinero de cada jugador, restandole constantBet a cada uno.
});

socket.on('nickNames', function(nicks){
  playGame.nickName(nicks);
});

socket.on('end', function(){
  console.log('Table is over');
});

socket.emit('join', "room1", 3);