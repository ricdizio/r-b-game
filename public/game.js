var game
var gameOpt = {
  gameWidth: 1133,
  gameHeight: 853,
  flipZoom: 1.1,
  flipSpeed: 500,
  moveSpeed: 500,
  fadeSpeed: 500
}

window.onload = function() {
  game = new Phaser.Game(gameOpt.gameWidth, gameOpt.gameHeight)
  game.state.add("playGame", playGame)
  game.state.add("waitRoom", waitRoom)
  game.state.start("waitRoom")
}

class cardGUI {
  constructor(posX, posY){
    this.update = false
    this.posX = posX
    this.posY = posY
  }
  make(){
    this.card = playGame.addSprite(644, 637, 'cardBack', 0, 0)
    this.card.animations.updateIfVisible = this.update
  }
  flip(index, zoom, size){
    this.card.isFlipping = true
    var flipTween = game.add.tween(this.card.scale).to({
      x: 0,
      y: gameOpt.flipZoom
    }, gameOpt.flipSpeed, Phaser.Easing.Linear.None)

    flipTween.onComplete.add(function(){
      this.card.loadTexture('card'+index)
      backFlipTween.start()
    }, this)

    var backFlipTween = game.add.tween(this.card.scale).to({
      x: size,
      y: size
    }, gameOpt.flipSpeed, Phaser.Easing.Linear.None)
    
    backFlipTween.onComplete.add(function(){
      this.card.isFlipping = false
    }, this)

    flipTween.start()
    this.move()
  }
  move(){
    var moveUpTween = game.add.tween(this.card).to({
      x: this.posX,
      y: this.posY
    }, gameOpt.moveSpeed, Phaser.Easing.Cubic.Out, true)
  }
  fade(){
    var fadeTween = game.add.tween(this.card).to({
        alpha: 0
    }, gameOpt.fadeSpeed, Phaser.Easing.Linear.None, true)
  }
  destroy(){
    this.card.destroy()
  }
}

class playerGUI {
  constructor(index, posX, posY, nick){
    this.index = index
    this.posX = posX
    this.posY = posY
    this.nick = nick
  }
  init(principal, gender){
    if(principal)
      this.circleTurn = playGame.addSprite(this.posX, this.posY, 'fplayer', 0, 0)
    else
      this.circleTurn = playGame.addSprite(this.posX, this.posY, gender+'player', 0, 0)
    }
  check(color, bool){
    if(bool){
      this.checkSprite = playGame.addSprite(this.posX, this.posY, 'check'+color, 0.5, 0.5, 1)
    }
    else{
      this.checkSprite.destroy()
    }
  }
  alert(bool){
    if(bool){
      this.alertSprite = playGame.addSprite(this.posX, this.posY,'alert', 0.5, 0.5, 1)
    } else{
      this.alertSprite.destroy()
    }
  }
  friendReq(posX, posY){
    this.buttonF = game.add.button(posX, posY, 'buttonF', this.addFriend, this, 0, 0, 0)   
    this.buttonF.input.useHandCursor = true
  }
  addFriend(){
    console.log("Friend "+this.nick+" Added")
    this.buttonF.destroy()
  }
}

class starGUI {
  constructor(pX, pY){
    this.pX = pX
    this.pY = pY
    this.star = game.add.sprite(pX, pY, 'starLose')
  }
  update(win){
    if(win)
      this.star.loadTexture("starWin")
    else
      this.star.loadTexture("starLose")
  }
}
var i = 0

var playGame = {
  timerAngle: { min: 0, max: 0 },
  colorRed: 0x77e5f0,
  colorGreen: 0x77e5f0,
  timerWidth: 6,
  btnEnum: Object.freeze({PICK: 0, POOL: 1, REQ:3 }),
  statusEnum: Object.freeze({ONLINE: 0, STANDBY: 1, OFF: 2}),
  nCards: 0,
  timerOn: true,
  nRound: 0,
  gameParameters: function(type=0, players=4, rounds=5, time=30, nick, gender=[1,0,1,0,1], money=500){
    if(type == 0)
      this.roomType = 'Normal'
    if(players == 4){
      this.maxPlayers = 4
      this.balancePos = new Array({x:560,y:480},{x:269,y:355}, {x:562, y:215}, {x:848,y:355})
      this.playerPos = new Array({x:532,y:546},{x:153,y:337}, {x:547, y:129}, {x:934,y:337})
      this.coinPos = new Array({x:530,y:479},{x:239,y:354}, {x:532, y:214}, {x:818,y:354})
      this.nickPos = new Array({x:503,y:644},{x:49,y:342}, {x:541, y:21}, {x:1015,y:342})
      this.timerPos = new Array({x:712,y:646},{x:712,y:646},{x:712,y:646},{x:712,y:646})
      this.btnAddPos = new Array({x:50,y:395}, {x:532,y:76}, {x:1006,y:395})
      
      this.nickStyle = new Array(
        {font: "bold 20px Arial",fill:"#68c9d2",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"center"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"left"}
      )
    }
    if(players == 3){
      this.maxPlayers = 3
      this.nickStyle = new Array(
        {font: "bold 20px Arial",fill:"#68c9d2",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"left"}
      )
    }
    if(rounds == 5){
      this.maxRounds = 5
      this.cardPos = new Array(362, 444, 526, 608, 690)
    }
    if(rounds == 4){
      this.maxRounds = 4
    }
    this.currentTimer = this.timerPos[0]
    this.nickSmallPos = new Array(655, 682, 710, 738)
    this.ratingPlayer = new Array(652, 679, 707, 735)
    this.posStarX = new Array(157, 197, 237, 277, 317)
    this.roudPos = new Array(161, 200, 240, 280, 320)
    this.pSmallPos = new Array(654, 681, 710, 737)
    this.posStarY = new Array(655, 683, 711, 739)
    this.pGender = new Array()
    this.iniMoney = money
    this.playTime = time
    //this.nicks = nick
    this.nicks = ["Victor", "Gabriel", "Ricardo", "Maria"]
    for(i=0; i<this.maxPlayers; i++){
      if(gender[i])
        this.pGender.push('m')
      else
        this.pGender.push('w')
    }
  },
  preload: function() {
    this.gameParameters()
    game.config.setForceTimeOut = true
    game.stage.disableVisibilityChange = true

    game.load.image('table', 'assets_ico/mesa_ico.png')
    game.load.image('mplayer', 'assets_ico/hombre_avatar_ico.png')
    game.load.image('wplayer', 'assets_ico/mujer_avatar_ico.png')
    game.load.image('fplayer', 'assets_ico/jugador_principal_ico.png')
    game.load.image('starWin', 'assets_ico/star_ganador_ico.png')
    game.load.image('starLose', 'assets_ico/star_perdedor_ico.png')
    game.load.image('mSmall', 'assets_ico/hombre_small_ico.png')
    game.load.image('wSmall', 'assets_ico/mujer_small_ico.png')
    game.load.image('cardBack', 'assets_ico/carta_back_ico.png')
    game.load.image('coin', 'assets_ico/disponible_ico.png')
    game.load.image('dupTime', 'assets_ico/duplicar_tiempo_ico.png')
    game.load.spritesheet('buttonR', 'assets_ico/btn_red_ico.png', 72, 42, 1)
    game.load.spritesheet('buttonB', 'assets_ico/btn_black_ico.png', 72, 42, 1)
    game.load.spritesheet('buttonA', 'assets_ico/btn_accept_ico.png', 77, 28, 1)
    game.load.spritesheet('buttonD', 'assets_ico/btn_deny_ico.png', 77, 28, 1)
    game.load.spritesheet('buttonF', 'assets_ico/btn_agregar_ico.png', 77, 28, 1)

    for(i = 0; i < 5; i++){
      game.load.image("card" + i, "assets_ico/carta_" + (i+1) + ".png")
    }
  },
  addSprite: function(posX, posY, spriteID, anchorX = 0, anchorY = 0, scale = false){
    var auxSprite = game.add.sprite(posX, posY, spriteID)
    auxSprite.anchor.set(anchorX, anchorY)
    if(scale)
      auxSprite.scale.set(scale)

    return auxSprite
  },
  addText: function(posX, posY, text, anchorX = 0, size = 12){
    var auxText = game.add.text(posX, posY,text, { fontSize: size+'px', fill: '#FFF' })
    auxText.anchor.set(anchorX,0)

    return auxText
  },
  addDraw: function(){
    game.stage.backgroundColor = 0x181818
    var graphics = game.add.graphics(0, 0)
    this.statusCircle = game.add.graphics(0,0)
    this.timerCircle = game.add.graphics(0, 0)
    this.currentRound = game.add.graphics(0,0)

    graphics.beginFill(0x060606)
    graphics.drawRect(0, 791, 1133, 62)
    graphics.endFill()

    graphics.beginFill(0x0a0a0a)
    graphics.drawRoundedRect(40, 650, 300, 25, 18)
    graphics.endFill()

    graphics.beginFill(0xb30202,1)
    graphics.drawRoundedRect(424, 801, 170, 42, 7)
    graphics.endFill()

    graphics.lineStyle(1, 0xb30202)
    graphics.drawRoundedRect(624, 800, 274, 42, 7)
    graphics.drawRoundedRect(928, 800, 170, 42, 7)

    graphics.lineStyle(2, 0x202020)
    graphics.moveTo(622, 639); graphics.lineTo(622, 743)
    graphics.moveTo(246, 805); graphics.lineTo(246, 840)
    graphics.moveTo(609, 805); graphics.lineTo(609, 840)
    graphics.moveTo(913, 805); graphics.lineTo(913, 840)

    graphics.beginFill(0xd8d8d8, 1)
    graphics.drawCircle(this.playerPos[0].x+34, this.playerPos[0].y+39, 100)
    for(i=1; i< this.maxPlayers; i++){
      graphics.drawCircle(this.playerPos[i].x+24, this.playerPos[i].y+27, 70)
    }
    for(i=0; i< this.maxPlayers; i++){
      graphics.drawCircle(52.5, this.ratingPlayer[i]+10, 20)
    }
    graphics.endFill()
    
    graphics.lineStyle(1, 0xFFFFFF, 1)
    graphics.drawRoundedRect(539, 480, 67, 19, 4)
    graphics.drawRoundedRect(248, 355, 67, 19, 4)
    graphics.drawRoundedRect(541, 215, 67, 19, 4)
    graphics.drawRoundedRect(827, 355, 67, 19, 4)

    this.currentRound.lineStyle(1, 0x5e5d5d)
    this.currentRound.drawRoundedRect(146, 619, 37, 150, 7)

    this.timerCircle.beginFill(0xffffff)
    this.timerCircle.drawCircle(689+23, 646, 46)
    this.timerCircle.endFill()
    

    this.radialProgressBar = game.add.graphics(0, 0)
    this.timerBar = game.add.tween(this.timerAngle).to( { max: 360 }, this.playTime*1000, "Linear", true, 0, 0, false)
  },
  addGameTexts: function(){
    var roundStyle = {fontSize: '12px', fill: '#FFF' ,fontWeight: 'normal' }
    game.add.text(693, 808, 'DUPLICATE PLAY TIME',{fontSize: '11px', fill: '#FFF' ,fontWeight: 'normal' })
    game.add.text(312, 808, 'INITIAL MONEY',{fontSize: '9px', fill: '#FFF' ,fontWeight: 'normal'})
    game.add.text(330, 820, '$ '+this.iniMoney, {fontSize: '15px', fill: '#FFF'})
    game.add.text(94, 808, 'ROOM TYPE',{fontSize: '9px', fill: '#FFF' ,fontWeight: 'normal' })
    game.add.text(96, 820, this.roomType, {fontSize: '15px', fill: '#FFF'})
    game.add.text(71, 628, 'ROUNDS',{fontSize: '12px', fill: '#FFF' ,fontWeight: 'normal' })

    for(i=0; i<this.maxRounds; i++){
      game.add.text(this.roudPos[i], 628, i+1,roundStyle)
    }
    this.timerText = game.add.text(704, 637,"",{fontSize: '15px', fill: '#4a4a4a',fontWeight:'normal'})
    this.turnText = game.add.text(754, 650,"",{fontSize: '20px', fill: '#c8c8c8',fontWeight:'normal'})
    this.turnText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    this.turnText2 = game.add.text(754, 674,"",{fontSize: '14px', fill: '#c8c8c8',fontWeight:'normal'})
  },
  create: function() {
    game.add.sprite(161,144,'table')
    var balanceStyle = { fontSize: '16px', fill: '#fff', fontWeight: 'normal' }
    var starNickStyle = { fontSize: '12px', fill: '#bdbdbd', fontWeight: 'normal' }
    this.timer = game.time.create(false)
    this.balanceArray = new Array()
    this.playerSmall = new Array()
    this.playerArray = new Array()
    this.starsArray = new Array()
    this.cardArray = new Array()
    this.nickName = new Array()
    this.addDraw()
    this.addGameTexts()
    for(i=0; i<this.maxPlayers; i++){
      this.playerSmall.push(this.addSprite(46, this.pSmallPos[i], this.pGender[i]+'Small'))
      this.balanceArray.push(game.add.text(this.balancePos[i].x, this.balancePos[i].y,'', balanceStyle))
      this.playerArray.push(new playerGUI(i+1, this.playerPos[i].x, this.playerPos[i].y, this.nicks[i]))
      this.nickName.push(game.add.text(0, 0, this.nicks[i], this.nickStyle[i]))
      this.nickName[i].setTextBounds(this.nickPos[i].x, this.nickPos[i].y, 80, 46)
      this.addSprite(this.coinPos[i].x, this.coinPos[i].y, 'coin')
      this.balanceArray[i].text = this.iniMoney
      this.updateStatus(i,this.statusEnum.ONLINE)
      this.playerArray[i].init(!i, this.pGender[i])
      game.add.text(72, this.nickSmallPos[i],this.nickName[i].text, starNickStyle)
      for(var j = 0; j < this.maxRounds; j++){
        this.starsArray.push(new starGUI(this.posStarX[j],this.posStarY[i]))
      }
    }

    for(i=1; i<this.maxPlayers; i++){
      this.playerArray[i].friendReq(this.btnAddPos[i-1].x, this.btnAddPos[i-1].y)
    }
    for(i=0; i<this.maxRounds; i++){
      this.cardArray.push(new cardGUI(this.cardPos[i],304))
      this.cardArray[i].make()
    }

    this.addSprite(640, 809, 'dupTime')
    
    var countDown = this.playTime
    this.timer.loop(1000,function(){
      this.timerText.text = countDown--
      if(countDown<1){
        this.timer.stop()
        this.timerText.text = ''
      }
    }, this)
    this.timerText.text = countDown--
    this.timer.start()

    game.time.events.add(Phaser.Timer.SECOND*5, function(){
      this.btnUpdate(this.btnEnum.PICK, true)
      this.timerOn = false
      this.timer.stop()
      this.timerText.text = ''
      this.timerCircle.clear()
    }, this)
  
    var winArr = new Array(1,3)
    this.updateWinners("",0,winArr,0)
    var winArr1 = new Array(0,1,3)
    this.updateWinners("",0,winArr1,4)
    game.world.bringToTop(this.timerCircle)
    game.world.bringToTop(this.timerText)
  },
  updateStatus: function(player, status){
    var posX, posY
    if(status == 0){
      this.statusCircle.beginFill(0x7ed321)
    }else if(status == 1){
      this.statusCircle.beginFill(0xf5a623)
    }else if(status == 2){
      this.statusCircle.beginFill(0xb30202)
    }
    if(player == 0){
      posX=488; posY=651
    }else if(player == 1){
      posX=34; posY=349
    }else if(player == 2){
      posX=526; posY=28
    }else if(player == 3){
      posX=1000; posY=350
    }
    this.statusCircle.drawCircle(posX, posY,10)
    this.statusCircle.endFill()

  },
  btnUpdate: function(btn, display){
    if(btn == 0){
      if(display){
        this.turnText.text = "YOUR TURN"
        this.turnText2.text = "Pick a color:"
        this.buttonR = game.add.button(754, 705, 'buttonR', this.onClickR, this, 0, 0, 0)
        this.buttonB = game.add.button(832, 705, 'buttonB', this.onClickB, this, 0, 0, 0)    
        this.buttonR.input.useHandCursor = true
        this.buttonB.input.useHandCursor = true
      }else{
        this.turnText.text = ''
        this.turnText2.text = ''
        this.buttonR.destroy()
        this.buttonB.destroy()
      }
    }else if(btn == 1){
      if(display){
        var poolYes = game.add.button(game.width*0.65, game.height*0.8, 'poolR', this.poolAccept, this, 0, 0, 0)
        var poolNo = game.add.button(game.width*0.35, game.height*0.8, 'poolR', this.poolDenied, this, 1, 1, 1)    
        poolYes.anchor.set(0.5)
        poolNo.anchor.set(0.5)
        poolYes.scale.set(0.35)
        poolNo.scale.set(0.35)
        poolYes.input.useHandCursor = true
        poolNo.input.useHandCursor = true
      }else{
        poolYes.destroy()
        poolNo.destroy()
      }
    }else if(btn == 2){
      if(display){
        buttonA = game.add.button(999, 48, 'buttonA', this.onClickR, this, 0, 0, 0)
        buttonD = game.add.button(999, 78, 'buttonD', this.onClickB, this, 0, 0, 0)    
        buttonA.input.useHandCursor = true
        buttonD.input.useHandCursor = true
      }else{
        buttonA.destroy()
        buttonD.destroy()
      }
    }
  },
  onClickR: function(){
    this.btnUpdate(this.btnEnum.PICK, false)
    console.log("RED BUTTON")
    for(i=0; i< this.maxRounds; i++){
      this.cardArray[i].flip(i,1,1)
    }
    this.updateRound(++this.nRound)
    //socket.emit('getPlay', true)
  },
  onClickB: function(){
    this.timerBar.stop()
    this.timerOn = false
    this.timerCircle.destroy()
    this.btnUpdate(this.btnEnum.PICK, false)

    this.updateRound(++this.nRound)
    //socket.emit('getPlay', false)
    console.log("BLACK BUTTON")
  },
  poolRequest: function(req){
    this.btnUpdate(this.btnEnum.POOL, true)
  },
  poolAccept: function(){
    this.btnUpdate(this.btnEnum.POOL, false)
   socket.emit('getPoolAnswer', true, socket.id)
  },
  poolDenied: function(){
    this.btnUpdate(this.btnEnum.POOL, false)
    socket.emit('getPoolAnswer', false, socket.id)
  },
  alertTurn: function(select, playerIndex, playerText, time){

    this.playTime = time
    this.timerBar = game.add.tween(this.timerAngle).to( { max: 360 }, this.playTime, "Linear", true, 0, 0, false)
    this.timerOn = true
    this.timerBar.onComplete.add(function(){
      this.timerOn = false
      this.radialProgressBar.clear()
    }, this)
    this.currentTimer = this.timerPos[playerIndex]
    //this.playerArray[playerIndex].alert(true)
    this.btnUpdate(this.btnEnum.PICK, true)
  },
  checkPlayer: function(playerIndex, color){
    this.timerOn = false
    this.timerBar.stop()
    this.timerAngle.max = 0
    this.btnUpdate(this.btnEnum.PICK, false)
    this.radialProgressBar.clear()
    //this.playerArray[playerIndex].check(color, true)
    //this.playerArray[playerIndex].alert(false)
  },
  showCard: function(card, suit) {
    this.cardArray[this.nCards].flip(card, gameOpt.flipZoom, 1)
    this.printWinColor(card)
    this.cardArray[this.nCards].move(true, 0,0)
    this.nCards++
    this.cardArray.push(new cardGUI())
    if(this.nCards!=this.maxRounds){
      this.cardArray[this.nCards].make()
    }
    //game.time.events.add(Phaser.Timer.SECOND*time, this.cardArray[nCards].move, this)
    //this.cardArray[nCards].move()
  },
  showFirst: function(card){
    this.printWinSuit(card.suit)
    this.cardArray[this.nCards].make()
    this.firstCard.flip(card, 1, 1.4)
    this.firstCard.move(true,0,0)
    game.time.events.add(Phaser.Timer.SECOND*2, function(){
      this.firstCard.fade()
    }, this) 
  },
  printWinColor: function(card) {
    if(card.color){
      this.colorText.text = '¡RED!'
    }
    else{
      this.colorText.text = '¡BLACK!'
    }
  },
  printWinSuit: function(suit){

    if(suit == 0)
      console.log('CLUBS')
    if(suit == 0)
      console.log('CLUBS')
    if(suit == 0)
      console.log('CLUBS')
    if(suit == 0)
      console.log('CLUBS')
  },
  updateWinners: function(winText, prize, winners, round){
    if(prize != 0){
      //this.winnerText.text = winText +''+ prize
    }
    else{
      //this.winnerText.text = winText
    }
    for(i = 0; i<winners.length; i++){
      this.starsArray[winners[i]*5+round].update(true)
    }
  },
  updateBalane: function(balance){
    for(i = 0; i< balance.length ; i++)
    this.balanceText[i].text = balance[i]
  },
  updateRound: function(roundNumber){
    this.currentRound.clear()
    this.currentRound.lineStyle(1, 0x5e5d5d)
    this.currentRound.drawRoundedRect(146+(roundNumber*40), 619, 37, 150, 7)

    if(roundNumber>1)
      for(i =0; i<this.maxPlayers; i++){
        //this.playerArray[i].check(0, false)
      }
  },
  alertTimer: function(){
    if(this.timerOn){
      this.radialProgressBar.clear()
      this.radialProgressBar.lineStyle(this.timerWidth, 0x77e5f0)

      this.radialProgressBar.lineColor = Phaser.Color.interpolateColor(this.colorGreen, this.colorRed, 360, this.timerAngle.max, 1)

      this.radialProgressBar.arc(this.currentTimer.x, this.currentTimer.y, 26, this.timerAngle.min, game.math.degToRad(this.timerAngle.max), false)
      this.radialProgressBar.endFill()
    }else{
      this.radialProgressBar.clear() 
    }
  },
  update: function(){
    this.alertTimer()
  }
}

class checkGUI {
  constructor(posX, posY, value){
    var button = game.add.sprite(posX-8,posY-8,'btnCheck')// = game.add.graphics(0, 0)
    this.point = game.add.graphics(0, 0)

    //graphic.beginFill(0xffffff)
    //graphic.drawCircle(posX, posY, 16)
    //graphic.endFill()
    
    button.inputEnabled = true
    button.value = value
    button.events.onInputDown.add(waitRoom.btnCheck, this)
    button.input.useHandCursor = true
    this.point.beginFill(0xd0021b)
    this.point.drawCircle(posX, posY,8)
    this.point.endFill()
    this.update(false)
  }
  update(check){
    this.point.alpha = check
  }
}


var waitRoom = {
  statusEnum: Object.freeze({OWNER: 1, READY: 2, WAITING:3 }),
  preload: function() { 
    game.stage.backgroundColor = 0x181818
    game.config.setForceTimeOut = true
    game.stage.disableVisibilityChange = true
    game.add.plugin(PhaserInput.Plugin)

    game.load.image('card1', 'assets_ico/carta_1.png')
    game.load.image('card2', 'assets_ico/carta_small_ico.png')
    game.load.image('cardBack', 'assets_ico/carta_back_ico.png')
    game.load.image('cardBackB', 'assets_ico/carta_oculta_big_ico.png')
    game.load.image('mPlayer', 'assets_ico/room_hombre.png')
    game.load.image('wPlayer', 'assets_ico/room_mujer.png')
    game.load.image('privateR', 'assets_ico/privada_ico.png')
    game.load.image('publicR', 'assets_ico/publica_ico.png')
    game.load.image('betCoin', 'assets_ico/monto_apuesta_ico.png')
    game.load.image('3players', 'assets_ico/3_jugadores_ico.png')
    game.load.image('4players', 'assets_ico/4_jugadores_ico.png')
    game.load.image('5hand', 'assets_ico/mano_5_ico.png')
    game.load.image('9hand', 'assets_ico/mano_9_ico.png')
    game.load.image('dupTime', 'assets_ico/duplicar_tiempo_ico.png')
    game.load.image('changeBet', 'assets_ico/apuesta_ico.png')
    game.load.image('btnCheck', 'assets_ico/btn_check_ico.png')
    game.load.spritesheet('return', 'assets_ico/arrow_back_ico.png',24,24,1)    
    game.load.spritesheet('previous', 'assets_ico/atras_ico.png',17,16,1)
    game.load.spritesheet('next', 'assets_ico/siguiente_ico.png',17,16,1)
    game.load.spritesheet('change', 'assets_ico/btn_cambiar_apuesta.png', 170, 42, 1)
    game.load.spritesheet('bet', 'assets_ico/btn_cambiar_apuesta.png', 72, 42, 1)
    game.load.spritesheet('create', 'assets_ico/btn_create_ico.png', 170, 42, 1)
    game.load.spritesheet('start', 'assets_ico/btn_start_ico.png', 170, 42, 1)

    for(i = 0; i < 5; i++){
      game.load.image("card" + i, "assets_ico/carta_" + (i+1) + ".png")
    }
  },
  texts: function(){
    var titleStyle = {fontSize: '18px', fill: '#f5a623' ,fontWeight: 'normal' }
    var returnStyle = {fontSize: '18px', fill: '#ffffff' ,fontWeight: 'normal' }
    var subTitleStyle = {fontSize: '16px', fill: '#bdbbbb' ,fontWeight: 'normal' }
    var paramStyle = {fontSize: '15px', fill: '#bdbbbb' ,fontWeight: 'normal' }
    var descriptionStyle = {fontSize: '14px', fill: '#ffffff' ,fontWeight: 'normal' }
    var timeStyle = {fontSize: '18px', fill: '#bdbbbb' ,fontWeight: 'normal' }
    game.add.text(660, 627, '15 seg', returnStyle)
    game.add.text(798, 627, '30 seg', returnStyle)
    game.add.text(936, 627, '45 seg', returnStyle)
    game.add.text(51, 20, 'RETURN TO ROOMS', returnStyle)
    game.add.text(38, 76, 'PICK A CARD',titleStyle)
    game.add.text(38, 340, 'WAITING ROOM',titleStyle)
    game.add.text(628, 76, 'GAME PARAMETERS ', titleStyle)
    game.add.text(629, 114, 'ROOM\'S NAME',subTitleStyle)
    game.add.text(629, 200, 'ROOM\'S TYPE',subTitleStyle)
    game.add.text(629, 377, 'INITIAL BET',subTitleStyle)
    game.add.text(629, 502, 'NUMBER OF PLAYERS',subTitleStyle)
    game.add.text(629, 588, 'TURN TIME',subTitleStyle)
    game.add.text(629, 677, 'NUMBER OF ROUNDS',subTitleStyle)
    game.add.text(40,114,'This is to select the first player. Who pick the highest card start.',descriptionStyle)
    
  },
  draw: function(){
    game.stage.backgroundColor = 0x181818
    var graphics = game.add.graphics(0, 0)

    graphics.beginFill(0x434343)
    graphics.drawRect(0, 0, 1132, 62)

    graphics.beginFill(0x060606)
    graphics.drawRect(0, 791, 1132, 62)
    graphics.endFill()
    graphics.beginFill(0xffffff)
    graphics.drawRoundedRect(630, 406, 70, 43, 5)

    graphics.lineStyle(1, 0x353535)
    graphics.moveTo(596, 0); graphics.lineTo(596, 853)
    graphics.lineStyle(3, 0x141313)
    graphics.moveTo(596, 354); graphics.lineTo(1113, 354)
    graphics.moveTo(596, 476); graphics.lineTo(1113, 476)
    graphics.moveTo(913, 805); graphics.lineTo(913, 840)

    graphics.endFill()

  },
  create: function() {
    this.draw()
    this.texts()
    this.num = 0
    this.nCards = 10
    this.maxPlayers = 4
    this.nPlayers = 0
    this.zoomLimit = {min: 221, mid:294.5, max: 368}
    this.scrollLimit = {min:94 , max: 422}
    this.scrollPos = {min: 94, mid:243, max: 422}
    this.scrollSpeed = 500
    this.scrollStep = 24
    this.month = new Array('January','Febreuary','March','May','June','July','August',
                           'September','October','November','December')
    this.aux = game.add.text(20, 20, this.num,{fontSize: '12px', fill: '#ffffff' ,fontWeight: 'normal' })
    this.playerInfo = new Array()
    this.infoText = new Array()
    this.infoPos = new Array()
    this.boolBtn = 0
    this.boolScroll = 0
    this.isBusy = false
    this.gameParams = {
      name: '',
      pass: '',
      type: 1,
      bet: 500,
      players: 4,
      time: 30,
      rounds: 5
    }
    paramStyle = {
      font: '16px Arial',
      fill: '#bbbbbb',
      fontWeight: 'normal',
      padding: 13,
      backgroundColor: '#4a4a4a',
      borderColor: '#4a4a4a',
      width: 438,
      height: 0,
      borderRadius: 5,
      max: 40,
      placeHolder: ''
    }
    betStyle = {
      font: '18px Arial',
      fill: '#d0021b',
      fontWeight: 'normal',
      padding: 12,
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      width: 200,
      height:0,
      borderRadius: 5,
      max: 40,
      type: 'numeric'
    }
    info1Style = {fontSize: '17px', fill: '#BDBBBB' ,fontWeight: 'normal'}
    info2Style = {fontSize: '12px', fill: '#BDBBBB' ,fontWeight: 'normal'}
    info3Style = {fontSize: '12px', fill: '#BDBBBB' ,fontWeight: 'normal'}
    
    paramStyle.placeHolder = "Name of the Room"
    var roomName = game.add.inputField(630, 140, paramStyle);
    paramStyle.placeHolder = "Password"
    var roomType = game.add.inputField(630, 262, paramStyle);
    this.roomBet = game.add.inputField(682, 406, betStyle);
    game.add.text(680, 416, '$',{fontSize: '20px', fill: '#d0021b' ,fontWeight: 'normal' })
    this.stStyle = {fontSize:'12px',fontWeight: 'normal', fill: '#d0021b'}
    this.roomBet.setText('1.860')
    this.infoPos.push({y1:379,y2:403,y3:425},{y1:477,y2:500,y3:520},{y1:580,y2:599,y3:618},{y1:676,y2:697,y3:715})
    this.infoText.push({t1:game.add.text(175,this.infoPos[0].y1,'',info1Style),
                        t2:game.add.text(175,this.infoPos[0].y2,'',info2Style),
                        t3:game.add.text(175,this.infoPos[0].y3,'',info3Style)},
                       {t1:game.add.text(175,this.infoPos[1].y1,'',info1Style),
                        t2:game.add.text(175,this.infoPos[1].y2,'',info2Style),
                        t3:game.add.text(175,this.infoPos[1].y3,'',info3Style)},
                       {t1:game.add.text(175,this.infoPos[2].y1,'',info1Style),
                        t2:game.add.text(175,this.infoPos[2].y2,'',info2Style),
                        t3:game.add.text(175,this.infoPos[2].y3,'',info3Style)},
                       {t1:game.add.text(175,this.infoPos[3].y1,'',info1Style),
                        t2:game.add.text(175,this.infoPos[3].y2,'',info2Style),
                        t3:game.add.text(175,this.infoPos[3].y3,'',info3Style)})

    this.checkBtns = new Array(new checkGUI(639,636,1), new checkGUI(780,636,2), new checkGUI(915, 636,3),
                               new checkGUI(639,242,4), new checkGUI(780,242,5),
                               new checkGUI(639,738,6), new checkGUI(780,738,7),
                               new checkGUI(639,552,8), new checkGUI(780,552,9))

    game.add.sprite(660, 232, 'privateR')
    game.add.sprite(798, 232, 'publicR')
    game.add.sprite(658, 542, '3players')
    game.add.sprite(796, 542, '4players')
    game.add.sprite(655, 724, '5hand')
    game.add.sprite(797, 718, '9hand')
    game.add.sprite(642, 414, 'betCoin')
    // game.add.sprite(60, 373, 'mPlayer')
    // game.add.sprite(60, 472, 'wPlayer')
    // game.add.sprite(60, 570, 'mPlayer')
    // game.add.sprite(60, 669, 'wPlayer')

    this.next = game.add.button(545, 242, 'next', this.bntNone, this, 0,0,0)
    this.prev = game.add.button(50, 242, 'previous', this.btnNone, this, 0,0,0)
    this.return = game.add.button(18, 19, 'return', this.btnReturn, this, 0,0,0)
    this.create = game.add.button(928, 10, 'create', this.btnCreate, this, 0,0,0)
    this.change = game.add.button(928, 406, 'change', this.btnChange, this, 0,0,0)
    this.start = game.add.button(928, 802, 'start', this.btnStart, this, 0,0,0)

    this.next.anchor.set(0.5, 0.5)
    this.prev.anchor.set(0.5, 0.5)

    this.next.onInputUp.add(function(){this.boolBtn = 0}, this);
    this.next.onInputDown.add(function(){this.boolBtn = 1}, this);
    this.next.onInputOut.add(function(){this.boolBtn = 0}, this);
    this.prev.onInputUp.add(function(){this.boolBtn = 0}, this);
    this.prev.onInputDown.add(function(){this.boolBtn = -1}, this);
    this.prev.onInputOut.add(function(){this.boolBtn = 0}, this)
    this.playerPos = new Array(373,472,570,669)
    this.statusPos = new Array({x:505,y:385}, {x:505.5,y:486}, {x:505.5,y:586},{x:505.5,y:686})
    this.statusPlayer = game.add.graphics(0,0)
    this.statusText = new Array()
    for(var i=0; i<this.maxPlayers; i++){
      this.statusText.push(game.add.text( this.statusPos[i].x, this.statusPos[i].y+15.5, '',{fontSize:'13px',fontWeight: 'normal'}))
      this.statusText[i].anchor.set(0.5)
    }

    this.cardPosX = new Array(70,94,118,147,184,243+13.5,331,368,398,422,446)
    this.cardPosY = new Array(198+53,197+53,196+53,196+53,195+53,170+72.5,195+53,196+53,196+53,197+53,198+53)
    this.scrollCards = new Array()
    for(var i=0; i<this.nCards; i++){
      this.scrollCards.push(game.add.sprite(this.cardPosX[i+1]+37, this.cardPosY[i+1], 'cardBackB'))
      this.scrollCards[i].anchor.set(0.5,0.5)
    }
    for(var i=this.nCards-1; i>3; i--){
      this.scrollCards[i].bringToTop()
    }
    this.scrollCards[4].inputEnabled = true
    this.scrollCards[4].input.useHandCursor = true
    this.scrollCards[4].events.onInputDown.add(this.pickCard, this)
    
    for(var i=0; i<this.nCards; i++){
      if(i!=4)
        this.scrollCards[i].scale.set(0.75)
    }
    this.scrollCards[this.nCards-1].alpha = 0
    this.extraCard = this.scrollCards.pop()
    this.pruebaDelay()
    this.checkBtns[1].update(true)
    this.checkBtns[4].update(true)
    this.checkBtns[5].update(true)
    this.checkBtns[8].update(true)
    console.log(waitRoom.gameParams)
  },
  pruebaDelay: function(){
    var date = {d:3,m:1,y:2018}
    game.time.events.add(Phaser.Timer.SECOND*3, function(){
      console.log("PRIMER DELAY ")
      this.updatePlayer(true, 'VICTOR GARCIA','m',1,date)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
    date = {d:12,m:12,y:2017}
    game.time.events.add(Phaser.Timer.SECOND*5, function(){
      console.log("SEGUNDO DELAY ")
      this.updatePlayer(true, 'RICARDO DI ZIO','w',1,date)
      this.updatePlayer(true, 'GABRIEL NOYA','w',1,date)
      this.updatePlayer(true, 'LEO CHUPALO','w',1,date)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
    game.time.events.add(Phaser.Timer.SECOND*7, function(){
      console.log("TERCER DELAY ")
      this.updatePlayer(false, 0,0,0,0,2)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
    game.time.events.add(Phaser.Timer.SECOND*9, function(){
      console.log("CUARTO DELAY ")
      this.updatePlayer(true, 'NOYA CHUPALO','w',1,date)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
  },
  updatePlayer: function(join, name, gender, chat, date, index=0){
    var j=0
    if(join){
      this.nPlayers++
      this.playerInfo.push({name: name, gender:gender, chat:chat, date:date, sprite:undefined, st:this.statusEnum.WAITING})
      this.playerInfo[this.nPlayers-1].sprite = game.add.sprite(60,this.playerPos[this.nPlayers],
                                                                this.playerInfo[this.nPlayers-1].gender+'Player')
      j=this.nPlayers-1
      this.playerInfo[0].st = this.statusEnum.OWNER                                                      
    }
    else{
      this.nPlayers--
      if(index==0){
        this.playerInfo[this.nPlayers+1].sprite.destroy()
        this.playerInfo.pop()
        j=this.nPlayers
      }else{
        this.playerInfo[index].sprite.destroy()
        this.playerInfo.splice(index,1)
        j=index-1
      }
      this.updateStatus(this.nPlayers,0)
      this.infoText[this.nPlayers].t1.text = ''
      this.infoText[this.nPlayers].t2.text = ''
      this.infoText[this.nPlayers].t3.text = ''
    }
    for(var i=j; i<this.nPlayers; i++){
      this.infoText[i].t1.text = this.playerInfo[i].name
      this.infoText[i].t2.text = 'Player since: '+this.month[this.playerInfo[i].date.m-1]+' '+
                                  this.playerInfo[i].date.d+' '+this.playerInfo[i].date.y
      this.infoText[i].t3.text = 'Picked card: '
      this.playerInfo[i].sprite.y = this.playerPos[i]
    }
  },
  btnCheck: function(button){
    var i=0, j=0
    if(button.value==1 || button.value==2 || button.value==3){
      i=0; j=3
      var time = new Array(15,30,45)
      waitRoom.gameParams.time = time[button.value-1]
    }
    if(button.value==4 || button.value==5){
      i=3; j=5
      waitRoom.gameParams.type = button.value - 4
    }
    if(button.value==6 || button.value==7){
      i=5; j=7
      var rounds = new Array(5,9)
      waitRoom.gameParams.rounds = rounds[button.value - 6]
    }
    if(button.value==8 || button.value==9){
      i=7; j=9
      waitRoom.gameParams.players = button.value - 5
    }
    console.log(waitRoom.gameParams)
    for(; i<j; i++){
      if(i==button.value-1)
        waitRoom.checkBtns[i].update(true)
      else
        waitRoom.checkBtns[i].update(false)
    }
  },
  btnNone: function(){
  },
  btnReturn: function(){
  },
  btnCreate: function(){
  },
  btnChange: function(){
  },
  btnStart: function(){
    game.state.start("playGame")
  },
  moveRight: function(){
    if(!this.isBusy){
      this.isBusy = true
      this.scrollCards.unshift(this.extraCard)
      this.scrollCards[0].x = this.cardPosX[0]+37

      game.add.tween(this.scrollCards[0]).to({
        alpha: 1
      }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)

      for(var i=0; i<this.nCards; i++){
        if(i==4){
          game.add.tween(this.scrollCards[i].scale).to({
            x: 1, y: 1
          }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
        }
        if(i==5){
          game.add.tween(this.scrollCards[i].scale).to({
            x: 0.75, y: 0.75
          }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
        }
        game.add.tween(this.scrollCards[i]).to({
          x: this.cardPosX[Math.min(i+1,10)]+37,
          y: this.cardPosY[Math.min(i+1,10)]
        }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
      }
      var scrollTween = game.add.tween(this.scrollCards[this.nCards-1]).to({
        alpha: 0
      }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
      self = this
      scrollTween.onComplete.add(function(){
        self.isBusy = false
        if(self.boolBtn>0){
          self.scrollSpeed = 350
        }
        else{
          self.scrollSpeed = 500
        }
      })
      for(var i=0; i<4; i++){
        this.scrollCards[i].bringToTop()
      }
      for(var i=this.nCards-1; i>3; i--){
        this.scrollCards[i].bringToTop()
      }
      this.extraCard = this.scrollCards.pop()
    }
  },
  moveLeft: function(){
    if(!this.isBusy){
      this.isBusy = true
      this.scrollCards.push(this.extraCard)
      this.scrollCards[this.nCards-1].x = this.cardPosX[this.nCards]+37

      game.add.tween(this.scrollCards[this.nCards-1]).to({
        alpha: 1
      }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)

      for(var i=0; i<this.nCards; i++){
        if(i==5){
          game.add.tween(this.scrollCards[i].scale).to({
            x: 1, y: 1
          }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
        }
        if(i==4){
          game.add.tween(this.scrollCards[i].scale).to({
            x: 0.75, y: 0.75
          }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
        }
        game.add.tween(this.scrollCards[i]).to({
          x: this.cardPosX[i]+37,
          y: this.cardPosY[i]
        }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
      }
      var scrollTween = game.add.tween(this.scrollCards[0]).to({
        alpha: 0
      }, this.scrollSpeed, Phaser.Easing.Cubic.Out, true)
      self = this
      scrollTween.onComplete.add(function(){
        self.isBusy = false
        if(self.boolBtn<0){
          self.scrollSpeed = 350
        }
        else{
          self.scrollSpeed = 500
        }
      })
      for(var i=this.nCards-1; i>4; i--){
        this.scrollCards[i].bringToTop()
      }
      for(var i=0; i<6; i++){
        this.scrollCards[i].bringToTop()
      }
      this.extraCard = this.scrollCards.shift()
    }
  },
  pickCard: function(){
    var flipTween = game.add.tween(this.scrollCards[4].scale).to({
      x: 0,
      y: 1.1
    }, 250, Phaser.Easing.Linear.None, true)

    var backFlipTween = game.add.tween(this.scrollCards[4].scale).to({
      x: 1.31,
      y: 1.3
    }, 250, Phaser.Easing.Linear.None)

    flipTween.onComplete.add(function(){
      this.scrollCards[4].loadTexture('card1')
      backFlipTween.start()
    }, this)
    
    backFlipTween.onComplete.add(function(){
      this.scrollCards[4].inputEnabled = false
      this.scrollCards[4].input.useHandCursor = false
    }, this)

    this.next.destroy()
    this.prev.destroy()
    flipTween.start()
    this.move()
  },
  updateStatus(player, status){
    var stColor, stColorHex
    if(status == 0){
      stColor = '#181818'
      stColorHex = 0x181818
      this.statusText[player].text = ''
    }
    if(status == 1){
      stColor = '#f5a623'
      stColorHex = 0xf5a623
      this.statusText[player].text = 'owner'
    }
    if(status == 2){
      stColor = '#b8e986'
      stColorHex = 0xb8e986
      this.statusText[player].text = 'ready'
    }
    if(status == 3 || status == 4){
      stColor = '#50e3c2'
      stColorHex = 0x50e3c2
      this.statusText[player].text = 'waiting'
    }
    this.stStyle.fill = stColor
    this.statusPlayer.lineStyle(1, stColorHex)
    this.statusText[player].setStyle(this.stStyle)
    this.statusPlayer.drawRoundedRect(446, this.statusPos[player].y,119,26, 5)
  },
  update: function(){
    if(this.boolBtn!=0){
      this.aux.text = this.num+=this.boolBtn
      if(this.boolBtn>0){
        this.next.scale.set(0.8)
        this.moveRight()
        this.scrollCards[5].inputEnabled = false
        //this.scrollCards[5].input.useHandCursor = false
      }else{
        this.prev.scale.set(0.8)
        this.moveLeft()
        this.scrollCards[3].inputEnabled = false
        //this.scrollCards[3].input.useHandCursor = false
      }
      this.scrollCards[4].inputEnabled = true
      this.scrollCards[4].input.useHandCursor = true
      this.scrollCards[4].events.onInputDown.add(this.pickCard, this)
    }
    else{
      this.next.scale.set(1)
      this.prev.scale.set(1)
    }
  },
  shutdown: function(){
    game.world.removeAll()
    console.log("waitRoom FINISH")
  }
}