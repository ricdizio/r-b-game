class cardGUI {
  constructor(posX, posY){
    this.update = false
    this.posX = posX
    this.posY = posY
    this.flipZoom= 1.1
    this.flipSpeed= 500
    this.moveSpeed= 500
    this.fadeSpeed= 500
  }
  make(){
    this.card = playGame.addSprite(644, 637, 'cardBack', 0, 0)
    this.card.animations.updateIfVisible = this.update
  }
  flip(index, size){
    this.card.isFlipping = true
    var flipTween = game.add.tween(this.card.scale).to({
      x: 0,
      y: this.flipZoom
    }, this.flipSpeed, Phaser.Easing.Linear.None)

    flipTween.onComplete.add(function(){
      this.card.loadTexture('card'+index)
      backFlipTween.start()
    }, this)

    var backFlipTween = game.add.tween(this.card.scale).to({
      x: size,
      y: size
    }, this.flipSpeed, Phaser.Easing.Linear.None)
    
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
    }, this.moveSpeed, Phaser.Easing.Cubic.Out, true)
  }
  fade(){
    var fadeTween = game.add.tween(this.card).to({
        alpha: 0
    }, this.fadeSpeed, Phaser.Easing.Linear.None, true)
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
  gameParameters: function(type=0, players=3, rounds=5, time=30, nick, gender=[1,0,1], money=500){
    if(type == 0)
      this.roomType = 'Normal'
    if(players == 4){
      this.maxPlayers = 4
      this.balancePos = new Array({x:560,y:480},{x:269,y:355}, {x:562, y:215}, {x:848,y:355})
      this.playerPos = new Array({x:532,y:546},{x:153,y:337}, {x:547, y:129}, {x:934,y:337})
      this.coinPos = new Array({x:530,y:479},{x:239,y:354}, {x:532, y:214}, {x:818,y:354})
      this.nickPos = new Array({x:515,y:644},{x:49,y:342}, {x:541, y:21}, {x:1015,y:342})
      this.timerPos = new Array({x:712,y:646},{x:712,y:646},{x:712,y:646},{x:712,y:646})
      this.stPos = new Array({x:488,y:655}, {x:34,y:349}, {x:526,y:28}, {x:1000,y:350})
      this.btnAddPos = new Array({x:50,y:395}, {x:532,y:76}, {x:1006,y:395})
      this.roundRectH = 150
      this.nickStyle = new Array(
        {font: "bold 20px Arial",fill:"#68c9d2",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"center"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"left"}
      )
    }
    if(players == 3){
      this.maxPlayers = 3
      this.balancePos = new Array({x:560,y:480},{x:330,y:241}, {x:798, y:241})
      this.playerPos = new Array({x:532,y:546},{x:235,y:160}, {x:848, y:160})
      this.coinPos = new Array({x:530,y:479},{x:300,y:240}, {x:768, y:240})
      this.nickPos = new Array({x:515,y:644},{x:220,y:110}, {x:835, y:110})
      this.timerPos = new Array({x:712,y:646},{x:712,y:646},{x:712,y:646})
      this.stPos = new Array({x:488,y:655}, {x:200,y:120}, {x:815,y:120})
      this.btnAddPos = new Array({x:120,y:170}, {x:935,y:170})
      this.roundRectH = 120
      this.nickStyle = new Array(
        {font: "bold 20px Arial",fill:"#68c9d2",boundsAlignH:"right"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"center"},
        {font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"center"}
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
    for(var i=0; i<this.maxPlayers; i++){
      if(gender[i])
        this.pGender.push('m')
      else
        this.pGender.push('w')
    }
  },
  init: function(type, capacity, rounds, time, players, gender1, money){
    game.gameParameters(type, capacity, rounds, time, players, gender1, money)
  },
  preload: function() {
    // this.gameParameters()
    // game.config.setForceTimeOut = true
    // game.stage.disableVisibilityChange = true

    // game.load.image('table', '../assets/mesa_ico.png')
    // game.load.image('mplayer', '../assets/hombre_avatar_ico.png')
    // game.load.image('wplayer', '../assets/mujer_avatar_ico.png')
    // game.load.image('fplayer', '../assets/jugador_principal_ico.png')
    // game.load.image('starWin', '../assets/star_ganador_ico.png')
    // game.load.image('starLose', '../assets/star_perdedor_ico.png')
    // game.load.image('mSmall', '../assets/hombre_small_ico.png')
    // game.load.image('wSmall', '../assets/mujer_small_ico.png')
    // game.load.image('cardBack', '../assets/carta_back_ico.png')
    // game.load.image('coin', '../assets/disponible_ico.png')
    // game.load.image('dupTime', '../assets/duplicar_tiempo_ico.png')
    // game.load.spritesheet('buttonR', '../assets/btn_red_ico.png', 72, 42, 1)
    // game.load.spritesheet('buttonL', '../assets/btn_leave_ico.png', 175, 47, 1)
    // game.load.spritesheet('buttonB', '../assets/btn_black_ico.png', 72, 42, 1)
    // game.load.spritesheet('buttonA', '../assets/btn_accept_ico.png', 77, 28, 1)
    // game.load.spritesheet('buttonD', '../assets/btn_deny_ico.png', 77, 28, 1)
    // game.load.spritesheet('buttonF', '../assets/btn_agregar_ico.png', 77, 28, 1)

    // for(i = 0; i < 5; i++){
    //   game.load.image("card" + i, "../assets/carta_" + (i+1) + ".png")
    // }
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

    // graphics.beginFill(0xb30202,1)
    graphics.beginFill(0x444444,1)
    graphics.drawRoundedRect(424, 801, 170, 42, 7)
    graphics.endFill()

    graphics.lineStyle(1, 0xb30202)
    graphics.drawRoundedRect(624, 800, 274, 42, 7)

    graphics.lineStyle(2, 0x202020)
    graphics.moveTo(622, 639); graphics.lineTo(622, 743)
    graphics.moveTo(246, 805); graphics.lineTo(246, 840)
    graphics.moveTo(609, 805); graphics.lineTo(609, 840)
    graphics.moveTo(913, 805); graphics.lineTo(913, 840)

    graphics.beginFill(0xd8d8d8, 1)
    graphics.drawCircle(this.playerPos[0].x+34, this.playerPos[0].y+39, 100)
    for(var i=1; i< this.maxPlayers; i++){
      graphics.drawCircle(this.playerPos[i].x+24, this.playerPos[i].y+27, 70)
    }
    for(var i=0; i< this.maxPlayers; i++){
      graphics.drawCircle(52.5, this.ratingPlayer[i]+10, 20)
    }
    graphics.endFill()
    
    graphics.lineStyle(1, 0xFFFFFF, 1)
    for(var i=0; i< this.maxPlayers; i++){
      graphics.drawRoundedRect(this.balancePos[i].x-21, this.balancePos[i].y, 67, 19, 4)
    }

    this.currentRound.lineStyle(1, 0x5e5d5d)
    this.currentRound.drawRoundedRect(146, 619, 37, this.roundRectH, 7)

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
    game.add.text(463, 814, 'CHANGE BET',{fontSize: '14px', fill: '#fff' ,fontWeight: 'normal' })
    for(var i=0; i<this.maxRounds; i++){
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
    for(var i=0; i<this.maxPlayers; i++){
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

    for(var i=1; i<this.maxPlayers; i++){
      this.playerArray[i].friendReq(this.btnAddPos[i-1].x, this.btnAddPos[i-1].y)
    }
    for(var i=0; i<this.maxRounds; i++){
      this.cardArray.push(new cardGUI(this.cardPos[i],304))
      this.cardArray[i].make()
    }

    this.addSprite(640, 809, 'dupTime')
    this.leaveBtn = game.add.button(928, 800, 'buttonL', this.shutdown, this, 0, 0, 0)   

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
  
    var winArr = new Array(1,2)
    this.updateWinners("",0,winArr,0)
    var winArr1 = new Array(0,1)
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

    this.statusCircle.drawCircle(this.stPos[player].x, this.stPos[player].y,10)
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
    for(var i=0; i< this.maxRounds; i++){
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
    this.cardArray[this.nCards].flip(card, 1)
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
    this.currentRound.drawRoundedRect(146+(roundNumber*40), 619, 37, this.roundRectH, 7)

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
  },
  shutdown: function(){
    game.world.removeAll()
    console.log("playGame FINISH")
  }
}