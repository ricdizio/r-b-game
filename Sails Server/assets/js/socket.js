var bet = 0;
var myPos = 0;
var myNicks = new Array()

////////////////////////////////////////////////////
/////////////// Cosas utilizadas
///////////////////////////////////////////////////

io.socket.post('/play/joinLobby', function(resData, jwRes){
  lobbyStage.addRoom(resData.waitingRooms);
});

function refresh(){
  io.socket.post('/play/refreshLobby', function(resData, jwRes){
    lobbyStage.addRoom(resData.waitingRooms);
    console.log(resData)
    console.log(jwRes)
  });
}

io.socket.on('waitingRoomJoin', function(nicksJSON){
  console.log(nicksJSON.nicks)
  for(var i=0; i<nicksJSON.nicks.length; i++){
    waitRoom.updatePlayer(i, true, nicksJSON.nicks[i])
  }
});



// Update btn
io.socket.on('waitingRoomBet', function(betJSON){
  // betJSON.bet
});
io.socket.on('waitingRoomLock', function(lockJSON){
  waitRoom.btnCheck(lockJSON.lock + 4)
});
io.socket.on('waitingRoomCapacity', function(capacityJSON){
  waitRoom.btnCheck(capacityJSON.capacity + 5)
});
io.socket.on('waitingRoomTurnTime', function(turnTimeJSON){
  waitRoom.btnCheck(turnTimeJSON.turnTime/15)
});
io.socket.on('waitingRoomRounds', function(roundsJSON){
  if(roundsJSON.rounds == 5){
    waitRoom.btnCheck(6)
  } else if(roundsJSON.rounds == 9){
    waitRoom.btnCheck(7)
  }
});

io.socket.on('startTableEnabled', function(){
  // Aparece boton para arrancar la mesa
    waitRoom.ready2Start()
});

io.socket.on('tableStarted', function(propertiesJSON){
  console.log(propertiesJSON.properties);
  var gender1 = [1,1,1]
  var type = 0;
  //console.log("Players: segundo "+myNicks)
  //console.log("Yo: "+myPos)

  game.state.start("playGame", true, false, propertiesJSON.properties.type, propertiesJSON.properties.roomCapacity, 
                      propertiesJSON.properties.rounds, propertiesJSON.properties.turnTime, 
                      myNicks, myPos, gender1, propertiesJSON.properties.roomBet * propertiesJSON.properties.rounds);
});

io.socket.on('logicalPlayers', function(nickJSON){
  var nicks = nickJSON.nicks;
  var myNick = nickJSON.myNick;
  var n = 0;
  while(myNick != nicks[0]){
      nicks.push(nicks.shift());
      n++;
  }
  myNicks = nicks;
  myPos = n;
});


io.socket.on('play', function(indexJSON){
  var index = indexJSON.index
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

io.socket.on('substractConstantBet', function(balanceJSON){
  var balance = balanceJSON.data;
  playGame.updateBalance(sortArray(balance));
  // Actualizar el dinero de cada jugador, restandole constantBet a cada uno.
});

io.socket.on('bettedColor', function(dataJSON){
  var color = dataJSON.color;
  var playerIndex = dataJSON.index;
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

io.socket.on('deal', function(cardJSON){
  logCard(cardJSON.card);
});

io.socket.on('reward', function(dataJSON){
  var dataArray = dataJSON.data;
  var winningPlayers = new Array();
  var balance = new Array();
  var j = 0;
  console.log("DENTRO DE REWARD")
  console.log(dataArray)
  // Asignamos winningPlayers como antes.
  for(var i = 0; i < dataArray.length; i++){
    if(dataArray[i].won){
      winningPlayers.push(dataArray[i].index);
    }
    balance.push(dataArray[i].balance);
  }

  // Acomodamos los indexes del array de winningPlayers.
  for(var i = 0; i < winningPlayers.length; i++){
    var a = winningPlayers[i]-myPos;
    if(a < 0) a += playGame.maxPlayers;
    winningPlayers[i] = a;
  }

  playGame.updateBalance(sortArray(balance));
  playGame.updateWinners(sortArray(winningPlayers));
});

////////////////////////////////////////////////////
/////////////// Cosas nuevas  
///////////////////////////////////////////////////


io.socket.on('waitingRoomDealtCard', function(pickedCardsJSON){
  console.log(pickedCardsJSON.pickedCards)
  // pickedCardsJSON.pickedCards es un arreglo de las cartas elegidas por los jugadores en su RESPECTIVA POSICION. [undefined, CARD, undefined, CARD]...
});





////////////////////////////////////////////////////
/////////////// Cosas pendientes
///////////////////////////////////////////////////

var currentTurn = 0;

function sendBet(){
  io.socket.post('getBet', parseInt(money.value));
}

function logCard(card){
  playGame.showCard(card);
  console.log("Card: " + card.number + " of " + card.suit);
}

io.socket.on('waitingRoomLeft', function(index, socketId){
  if(socketId != socket.id){
    waitRoom.updatePlayer(index, false)
  }  
});
io.socket.on('waitingRoomDealt', function(card, index, socketId){
  if(socketId == socket.id){
    waitRoom.pickCard()
  } 
  console.log(card)
});

io.socket.on('bettedMoney', function(money, playerIndex){
  console.log("Jugador " + (playerIndex + 1) + " aposto " + money);
});

io.socket.on('bet', function(betId, playerIndex){
  if(betId == socket.id){
    console.log("Te toca apostar");
    // Colocar en pantalla "te toca apostar"
  }
  else{
    console.log("Jugador " + (playerIndex + 1) + " esta apostando");
    //Colocar en pantalla "jugador playerindex+1 esta apostando"
  }
});

io.socket.on('suitRequest', function(){
  playGame.suitRequest();
});

io.socket.on('pickedSuit', function(suit, player){
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

io.socket.on('donePicking', function(card){
  console.log('Done Picking');
  playGame.showFirst(card);
});







io.socket.on('poolAccepted', function(){
  playGame.updateWinners('pool Aceepted!', 0);
});









io.socket.on('poolRequest', function(){
  playGame.poolRequest(true);
});

io.socket.on('round', function(round){
  // Aqui actualiza la ronda abajo a la izq.
  playGame.updateRound(round);
  console.log("Round " + (round));
});

io.socket.on('timedOut', function(playerIndex){
  // Aqui indica que el jugador playerIndex tardo demasiado y su turno fue pasado.
  console.log('Jugador ' + (playerIndex + 1) + ' ha tardado demasiado');
});


io.socket.on('nickNames', function(nicks){
  playGame.nickName(nicks);
});

io.socket.on('end', function(){
  console.log('Table is over');
});


function sortArray(array){
  for(var i=0; i<myPos; i++){
    array.push(array.shift());
  }
  return array
}


// io.socket.on('reward', function(winningPlayers, prize, balance){
//   console.log('premio: ' + prize);
//   var winText = "test";
//   if(winningPlayers === 0){
//     // winningPlayers es un arreglo con los playerIndex de los ganadores (0, 1, etc).
//     // balance contiene el dinero de cada jugador (del 0 a N jugadores).
//     /*for(var i = 0; i < winningPlayers.length; i++){
//       if(ids[winningPlayers[i]] == socket.id){
//         winText = 'You Win ';
//         console.log('You win ' + prize +'!');
//         break;
//       }
//       else{
//         winText = 'You Lose';
//         prize = 0;
//         console.log('You Lose ');
//       }
//     }*/
//   }
//   else{
//     // Mostrar en pantalla que gano la casa.
//     console.log("Gana la casa");
//     winText = 'The House Wins';
//     prize = 0;
//   }
  
//   for(var i = 0; i < winningPlayers.length; i++){
//     var a = winningPlayers[i]-myPos;
//     if(a < 0) a += playGame.maxPlayers;
//     winningPlayers[i] = a;
//   }
  
//   // Revisar por que winningplayers es 0
//   playGame.updateWinners(sortArray(winningPlayers));
//   console.log("Balance en REWARD: "+balance)
//   if(balance !== 0){
//     playGame.updateBalance(sortArray(balance));
//   }
  
// });