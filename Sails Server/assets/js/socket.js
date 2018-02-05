var socket = io.connect('http://192.168.1.138:3000');
var bet = 0;
var myPos=0;
var myNicks = new Array()

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

socket.on('pickedSuit', function(suit, player){
  if(suit == 'Clubs'){
    playGame.pickedSuit(0);
    suit = 0;
  }
  if(suit == 'Spades'){
    playGame.pickedSuit(1);
    suit = 1;
  }
  if(suit == 'Hearts'){
    playGame.pickedSuit(2);
    suit = 2;
  }
  if(suit == 'Diamonds'){
    playGame.pickedSuit(3);
    suit = 3;
  }
  playGame.checkSuit(suit, player);
});

socket.on('donePicking', function(card){
  console.log('Done Picking');
  playGame.showFirst(card);
});

socket.on('play', function(index){
  //if(!lastTurn){
    console.log("index: "+index+ " muPos: "+myPos)
    if(index == myPos){

      var i = index-myPos
      if(i<0) i += playGame.maxPlayers
      var name = myNicks[i]

      console.log("Te toca elegir!"+name);
      playGame.alertTurn(true, i);
      // Colocar en pantalla "te toca elegir"

    }
    else{
      // var i = index-myPos
      // if(i<0) i += playGame.maxPlayers
      // var name = myNicks[i]

      // console.log(name + " is Picking!");
      // playGame.alertTurn(false, name + " is Picking!");
      // Colocar en pantalla "jugador playerindex+1 esta eligiendo"
    }
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

socket.on('poolAccepted', function(){
  playGame.updateWinners('pool Aceepted!', 0);
});

socket.on('logicalPlayers', function(nicks, myNick){
  var n=0;
  while(myNick != nicks[0]){
    nicks.push(nicks.shift())
    n++;
  }
  myNicks = nicks
  myPos = n
  console.log("Players: "+nicks)
  console.log("Yo: "+myPos)
});

socket.on('reward3', function(winningPlayers, prize, balance, houseWon){
  console.log('premio: ' + prize);
  var winText = "test";
  if(!houseWon){
    // winningPlayers es un arreglo con los playerIndex de los ganadores (0, 1, etc).
    // balance contiene el dinero de cada jugador (del 0 a N jugadores).
    /*for(var i = 0; i < winningPlayers.length; i++){
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
    }*/
  }
  else{
    // Mostrar en pantalla que gano la casa.
    console.log("Gana la casa");
    winText = 'The House Wins';
    prize =0;
  }
  
  for(var i = 0; i < winningPlayers.length; i++){
    var a = winningPlayers[i]-myPos;
    if(a < 0) a += playGame.maxPlayers;
    winningPlayers[i] = a;
  }
  

  playGame.updateWinners(sortArray(winningPlayers));
  console.log("Balance en REWARD: "+balance)
  playGame.updateBalance(sortArray(balance));
});

socket.on('startTableEnabled', function(){
// Aparece boton para arrancar la mesa
  waitRoom.ready2Start()
});

socket.on('tableStarted', function(type=0, capacity, rounds, time, gender, money){
  var gender1 = [1,1,1]
  console.log("Players: segundo "+myNicks)
  console.log("Yo: "+myPos)
  game.state.start("playGame",true, false, type, capacity, rounds, time, myNicks, myPos, gender1, money)
});

socket.on('waitingRoomJoin', function(players){
  console.log(players)
  for(var i=0; i<players.length; i++){
    waitRoom.updatePlayer(i, true, players[i].nickName)
  }
});

socket.on('waitingRoomLeft', function(index, socketId){
  if(socketId != socket.id){
    waitRoom.updatePlayer(index, false)
  }  
});
socket.on('waitingRoomDealt', function(card, index, socketId){
  if(socketId == socket.id){
    waitRoom.pickCard()
  } 
  console.log(card)
});


socket.on('waitingRoomBet', function(bet){
 
});
socket.on('waitingRoomCapacity', function(capacity){
 
});
socket.on('waitingRoomTurnTime', function(time){
 
});
socket.on('waitingRoomRounds', function(rounds){
 
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

  playGame.updateBalance(sortArray(balance));
  // Actualizar el dinero de cada jugador, restandole constantBet a cada uno.
});

socket.on('nickNames', function(nicks){
  playGame.nickName(nicks);
});

socket.on('end', function(){
  console.log('Table is over');
});

//socket.emit('join', "room1", 3);

function sortArray(array){
  for(var i=0; i<myPos; i++){
    array.push(array.shift());
  }
  return array
}