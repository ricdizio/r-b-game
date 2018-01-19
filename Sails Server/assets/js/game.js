var game
var gameOpt = {
  gameWidth: 1133,
  gameHeight: 853,
}

window.onload = function() {
  game = new Phaser.Game(gameOpt.gameWidth, gameOpt.gameHeight)
  game.state.add("loadAssets", loadAssets)
  game.state.add("playGame", playGame)
  game.state.add("waitRoom", waitRoom)
  game.state.add("lobbyStage", lobbyStage)
  
  game.state.start("loadAssets")
}

loadAssets = {
  preload: function(){
    game.stage.backgroundColor = 0x181818
    game.config.setForceTimeOut = true
    game.stage.disableVisibilityChange = true
    game.add.plugin(PhaserInput.Plugin)
    
    //----- LOBBY ASSETS ---------------------------------------------------------
    game.load.image('initialBet', '../assets/monto_entrada_ico.png')
    //game.load.image('mplayer2', '../assets/room_player_ico.png')
    game.load.image('lock', '../assets/lock_ico.png')
    game.load.image('people', '../assets/room_player_ico.png')
    game.load.image('time', '../assets/tiempo_ico.png')
    game.load.image('dtime', '../assets/room_doubletime_ico.png')
    game.load.image('rBet0', '../assets/room_apuesta_ico.png')
    game.load.image('5hand', '../assets/mano_5_ico.png')
    game.load.image('9hand', '../assets/mano_9_ico.png')
    game.load.image('starWin', '../assets/star_ganador_ico.png')
    game.load.image('starLose', '../assets/star_perdedor_ico.png')
    game.load.spritesheet('btnCreateRoom','../assets/btn_rooms.png',170,42,1) 

    //----- WAITROOM ASSETS ------------------------------------------------------
    game.load.image('card1', '../assets/carta_1.png')
    game.load.image('card2', '../assets/carta_small_ico.png')
    game.load.image('cardBack', '../assets/carta_back_ico.png')
    game.load.image('cardBackB', '../assets/carta_oculta_big_ico.png')
    game.load.image('mPlayer', '../assets/room_hombre.png')
    game.load.image('wPlayer', '../assets/room_mujer.png')
    game.load.image('privateR', '../assets/privada_ico.png')
    game.load.image('publicR', '../assets/publica_ico.png')
    game.load.image('betCoin', '../assets/monto_apuesta_ico.png')
    game.load.image('3players', '../assets/3_jugadores_ico.png')
    game.load.image('4players', '../assets/4_jugadores_ico.png')
    // game.load.image('5hand', '../assets/mano_5_ico.png')
    // game.load.image('9hand', '../assets/mano_9_ico.png')
    game.load.image('dupTime', '../assets/duplicar_tiempo_ico.png')
    game.load.image('changeBet', '../assets/apuesta_ico.png')
    game.load.image('btnCheck', '../assets/btn_check_ico.png')
    game.load.spritesheet('return', '../assets/arrow_back_ico.png',24,24,1)    
    game.load.spritesheet('previous', '../assets/atras_ico.png',17,16,1)
    game.load.spritesheet('next', '../assets/siguiente_ico.png',17,16,1)
    game.load.spritesheet('change', '../assets/btn_cambiar_apuesta.png', 170, 42, 1)
    //game.load.spritesheet('bet', '../assets/btn_cambiar_apuesta.png', 72, 42, 1)
    game.load.spritesheet('create', '../assets/btn_create_ico.png', 170, 42, 1)
    game.load.spritesheet('start', '../assets/btn_start_ico.png', 170, 42, 1)

    //----- TABLE ASSETS --------------------------------------------------------------
    game.load.image('table', '../assets/mesa_ico.png')
    game.load.image('mplayer', '../assets/hombre_avatar_ico.png')
    game.load.image('wplayer', '../assets/mujer_avatar_ico.png')
    game.load.image('fplayer', '../assets/jugador_principal_ico.png')
    //game.load.image('starWin', '../assets/star_ganador_ico.png')
    //game.load.image('starLose', '../assets/star_perdedor_ico.png')
    game.load.image('mSmall', '../assets/hombre_small_ico.png')
    game.load.image('wSmall', '../assets/mujer_small_ico.png')
    //game.load.image('cardBack', '../assets/carta_back_ico.png')
    game.load.image('coin', '../assets/disponible_ico.png')
    //game.load.image('dupTime', '../assets/duplicar_tiempo_ico.png')
    game.load.spritesheet('buttonR', '../assets/btn_red_ico.png', 72, 42, 1)
    game.load.spritesheet('buttonL', '../assets/btn_leave_ico.png', 175, 47, 1)
    game.load.spritesheet('buttonB', '../assets/btn_black_ico.png', 72, 42, 1)
    game.load.spritesheet('buttonA', '../assets/btn_accept_ico.png', 77, 28, 1)
    game.load.spritesheet('buttonD', '../assets/btn_deny_ico.png', 77, 28, 1)
    game.load.spritesheet('buttonF', '../assets/btn_agregar_ico.png', 77, 28, 1)

    for(i = 0; i < 5; i++){
      game.load.image("card" + i, "../assets/carta_" + (i+1) + ".png")
    }
  },
  create: function(){
    game.state.start("lobbyStage")
  }
}
