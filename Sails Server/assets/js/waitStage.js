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
    // game.stage.backgroundColor = 0x181818
    // game.config.setForceTimeOut = true
    // game.stage.disableVisibilityChange = true
    // game.add.plugin(PhaserInput.Plugin)

    // game.load.image('card1', '../assets/carta_1.png')
    // game.load.image('card2', '../assets/carta_small_ico.png')
    // game.load.image('cardBack', '../assets/carta_back_ico.png')
    // game.load.image('cardBackB', '../assets/carta_oculta_big_ico.png')
    // game.load.image('mPlayer', '../assets/room_hombre.png')
    // game.load.image('wPlayer', '../assets/room_mujer.png')
    // game.load.image('privateR', '../assets/privada_ico.png')
    // game.load.image('publicR', '../assets/publica_ico.png')
    // game.load.image('betCoin', '../assets/monto_apuesta_ico.png')
    // game.load.image('3players', '../assets/3_jugadores_ico.png')
    // game.load.image('4players', '../assets/4_jugadores_ico.png')
    // game.load.image('5hand', '../assets/mano_5_ico.png')
    // game.load.image('9hand', '../assets/mano_9_ico.png')
    // game.load.image('dupTime', '../assets/duplicar_tiempo_ico.png')
    // game.load.image('changeBet', '../assets/apuesta_ico.png')
    // game.load.image('btnCheck', '../assets/btn_check_ico.png')
    // game.load.spritesheet('return', '../assets/arrow_back_ico.png',24,24,1)    
    // game.load.spritesheet('previous', '../assets/atras_ico.png',17,16,1)
    // game.load.spritesheet('next', '../assets/siguiente_ico.png',17,16,1)
    // game.load.spritesheet('change', '../assets/btn_cambiar_apuesta.png', 170, 42, 1)
    // game.load.spritesheet('bet', '../assets/btn_cambiar_apuesta.png', 72, 42, 1)
    // game.load.spritesheet('create', '../assets/btn_create_ico.png', 170, 42, 1)
    // game.load.spritesheet('start', '../assets/btn_start_ico.png', 170, 42, 1)

    // for(i = 0; i < 5; i++){
    //   game.load.image("card" + i, "../assets/carta_" + (i+1) + ".png")
    // }
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
    this.scrollCards[4].events.onInputDown.add(this.pickCardReq, this)
    
    for(var i=0; i<this.nCards; i++){
      if(i!=4)
        this.scrollCards[i].scale.set(0.75)
    }
    this.scrollCards[this.nCards-1].alpha = 0
    this.extraCard = this.scrollCards.pop()
    //this.pruebaDelay()
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
      this.updatePlayer(0,true, 'VICTOR GARCIA','m',1,date)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
    date = {d:12,m:12,y:2017}
    game.time.events.add(Phaser.Timer.SECOND*5, function(){
      console.log("SEGUNDO DELAY ")
      this.updatePlayer(0,true, 'RICARDO DI ZIO','w',1,date)
      this.updatePlayer(0,true, 'GABRIEL NOYA','w',1,date)
      this.updatePlayer(0,true, 'LEO CHUPALO','w',1,date)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
    game.time.events.add(Phaser.Timer.SECOND*7, function(){
      console.log("TERCER DELAY ")
      this.updatePlayer(0,false, 0,0,0,0,2)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
    game.time.events.add(Phaser.Timer.SECOND*9, function(){
      console.log("CUARTO DELAY ")
      this.updatePlayer(0,true, 'NOYA CHUPALO','w',1,date)
      for(var i=0; i<this.nPlayers; i++)
        this.updateStatus(i,this.playerInfo[i].st)
    }, this)
  },
  updatePlayer: function(index, join, name, gender='m', chat, date={d:17,m:1,y:2018}){
    var j=0
    if(join){
      console.log("index: "+index)
      console.log("nPlayers: "+this.nPlayers)
      if(this.nPlayers < index+1){
        console.log(name)
        this.nPlayers++
        this.playerInfo.push({name: name, gender:gender, chat:chat, date:date, sprite:undefined, st:this.statusEnum.WAITING})
        this.playerInfo[this.nPlayers-1].sprite = game.add.sprite(60,this.playerPos[this.nPlayers],
                                                  this.playerInfo[this.nPlayers-1].gender+'Player')
        j=this.nPlayers-1
        if(j == 0)
          this.playerInfo[0].st = this.statusEnum.OWNER 
      }                                          
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
      this.updateStatus(i, this.playerInfo[i].st)
    }
  },
  btnCheck: function(button){
    var i=0, j=0
    // Time
    if(button.value==1 || button.value==2 || button.value==3){
      i=0; j=3
      var time = new Array(15,30,45)
      waitRoom.gameParams.time = time[button.value-1]
      socket.emit('updateTurnTime',waitRoom.gameParams.time)
    }
    // Type
    if(button.value==4 || button.value==5){
      i=3; j=5
      waitRoom.gameParams.type = button.value - 4
      socket.emit('updateType',waitRoom.gameParams.type)
    }
    // Rounds
    if(button.value==6 || button.value==7){
      i=5; j=7
      var rounds = new Array(5,9)
      waitRoom.gameParams.rounds = rounds[button.value - 6]
      socket.emit('updateRounds',waitRoom.gameParams.rounds)
    }
    // Players
    if(button.value==8 || button.value==9){
      i=7; j=9
      waitRoom.gameParams.players = button.value - 5
      socket.emit('updateCapacity',waitRoom.gameParams.players)
    }
    console.log(waitRoom.gameParams)
    for(; i<j; i++){
      if(i==button.value-1)
        waitRoom.checkBtns[i].update(true)
      else
        waitRoom.checkBtns[i].update(false)
    }
  },
  paramUpdate: function(){

  },
  btnNone: function(){
  },
  btnReturn: function(){
    socket.emit('leaveWaitingRoom')
    game.state.start("lobbyStage")
  },
  btnCreate: function(){
  },
  btnChange: function(){
  },
  btnStart: function(){
    //socket.emit('getPlay', true)
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
  pickCardReq: function(){
    socket.emit('dealWaitingRoomCard', socket.id)
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
    //this.move()

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
      this.scrollCards[4].events.onInputDown.add(this.pickCardReq, this)
    }
    else{
      this.next.scale.set(1)
      this.prev.scale.set(1)
    }
  },
  ready2Start: function(){
    this.start = game.add.button(928, 802, 'start', this.btnStart, this, 0,0,0)
    socket.emit('startTable')
  },
  shutdown: function(){
    game.world.removeAll()
    console.log("waitRoom FINISH")
  }
}