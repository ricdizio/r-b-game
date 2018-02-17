var bet = 0;
var myPos = 0;
var myNicks = new Array()



////////////////////////////////////////////////////
/////////////// Lobby sockets
///////////////////////////////////////////////////

io.socket.post('/play/joinLobby', function(resData, jwRes){
    lobbyStage.addRoom(resData.waitingRooms);
});

function refresh(){
    io.socket.post('/play/refreshLobby', function(resData, jwRes){
        lobbyStage.addRoom(resData.waitingRooms);
    });
}
  
////////////////////////////////////////////////////
/////////////// Waiting room sockets
///////////////////////////////////////////////////

io.socket.on('waitingRoomJoin', function(nicksJSON){
    for(var i = 0; i < nicksJSON.nicks.length; i++){
      waitRoom.updatePlayer(i, true, nicksJSON.nicks[i])
    }
  });

io.socket.on('waitingRoomBet', function(betJSON){
    // betJSON.bet
});

io.socket.on('waitingRoomName', function(roomNameJSON){
    // roomNameJSON.roomName
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

io.socket.on('waitingRoomDealtCard', function(pickedCardsJSON){
    console.log(pickedCardsJSON.pickedCards)
    // pickedCardsJSON.pickedCards es un arreglo de las cartas elegidas por los jugadores en su RESPECTIVA POSICION. [undefined/null, CARD, undefined/null, CARD]...
  });

io.socket.on('startTableEnabled', function(){
    // Aparece boton para arrancar la mesa
    waitRoom.ready2Start();
});

io.socket.on('tableStarted', function(propertiesJSON){
    console.log(propertiesJSON.properties);
    console.log(propertiesJSON.players);
    var gender1 = [1,1,1]
    var type = 0;

    // game.state.start("playGame",true, false, propertiesJSON.type, propertiesJSON.capacity, 
    //                     propertiesJSON.rounds, propertiesJSON.time, 
    //                     myNicks, myPos, gender1, money);
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
    console.log("Players: "+nicks);
    console.log("Yo: "+myPos);
  });

////////////////////////////////////////////////////
/////////////// Table sockets
///////////////////////////////////////////////////

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
    var balance = balanceJSON.balance;
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