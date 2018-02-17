var bet = 0;
var myPos=0;
var myNicks = new Array()



////////////////////////////////////////////////////
/////////////// Lobby sockets
///////////////////////////////////////////////////

io.socket.post('/play/joinLobby');

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
    // pickedCardsJSON.pickedCards es un arreglo de las cartas elegidas por los jugadores en su RESPECTIVA POSICION. [undefined, CARD, undefined, CARD]...
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
    //console.log("Players: segundo "+myNicks)
    //console.log("Yo: "+myPos)

    // game.state.start("playGame",true, false, propertiesJSON.type, propertiesJSON.capacity, 
    //                     propertiesJSON.rounds, propertiesJSON.time, 
    //                     myNicks, myPos, gender1, money);
});

////////////////////////////////////////////////////
/////////////// X sockets
///////////////////////////////////////////////////