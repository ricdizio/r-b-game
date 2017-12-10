var game;

var gameOptions = {
  gameWidth: 1133,
  gameHeight: 853,
  cardSheetWidth: 65,
  cardSheetHeight: 81,
  cardScaleOff: 0.5,
  cardScaleOn: 1.2,
  circleScale: 0.4,
  alertScale: 0.45,
  checkScale: 0.4,
  buttonScale: 0.1,
  suitScale: 0.2,
  flipZoom: 1.2,
  flipSpeed: 500
}

var btnEnum = Object.freeze({PICK: 0, POOL: 1, FRIEND:3 });
var stEnum = Object.freeze({ONLINE: 0, STANDBY: 1, OFF: 2});
window.onload = function() {
  game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
  game.state.add("PlayGame", playGame);
  game.state.start("PlayGame");
}

var angle = { min: 0, max: 0 };
var color2 = 0x77e5f0;
var color1 = 0x77e5f0;
var alertWidth = 6;

class cardGUI {
  constructor(posX, posY){
    this.update = false;
    this.posX = posX;
    this.posY = posY;
  }
  make(){
    this.card = playGame.addSprite(644, 637, 'cardBack', 0, 0);
    this.card.animations.updateIfVisible = this.update;
  }
  flip(index, zoom, size){
    this.card.isFlipping = true;

    var flipTween = game.add.tween(this.card.scale).to({
      x: 0,
      y: zoom, //gameOptions.flipZoom
    }, gameOptions.flipSpeed, Phaser.Easing.Linear.None);

    flipTween.onComplete.add(function(){
      this.card.loadTexture('card'+index);
      backFlipTween.start();
    }, this);

    var backFlipTween = game.add.tween(this.card.scale).to({
      x: size,//gameOptions.cardScaleOn,
      y: size, //gameOptions.cardScaleOn
    }, gameOptions.flipSpeed, Phaser.Easing.Linear.None);
    
    backFlipTween.onComplete.add(function(){
      this.card.isFlipping = false;
    }, this);

    flipTween.start();
    this.move(true,0,0);
  }
  move(toTable, posX=0, posY=0){
    if(toTable){
      posX = this.posX;
      posY = this.posY;
    }
    var moveUpTween = game.add.tween(this.card).to({
      x: posX,
      y: posY
    }, 500, Phaser.Easing.Cubic.Out, true);
  }
  fade(){
    var fadeTween = game.add.tween(this.card).to({
        alpha: 0
    }, 500, Phaser.Easing.Linear.None, true);
  }
  destroy(){
    this.card.destroy();
  }
}

class playerGUI {
  constructor(index, posX, posY){
    this.index = index;
    this.posX = posX;
    this.posY = posY;
  }
  init(principal){
    if(principal)
      this.circleTurn = playGame.addSprite(this.posX, this.posY, 'fplayer', 0, 0);
    else
      this.circleTurn = playGame.addSprite(this.posX, this.posY, 'mplayers', 0, 0);
    }
  check(color, bool){
    if(bool){
      this.checkSprite = playGame.addSprite(this.posX, this.posY, 'check'+color, 0.5, 0.5, gameOptions.checkScale);
    }
    else{
      this.checkSprite.destroy();
    }
  }
  alert(bool){
    if(bool){
      this.alertSprite = playGame.addSprite(this.posX, this.posY,'alert', 0.5, 0.5, gameOptions.alertScale);
    } else{
      this.alertSprite.destroy();
    }
  }
}

class starGUI {
  constructor(pX, pY){
    this.pX = pX;
    this.pY = pY;
    this.star = game.add.sprite(pX, pY, 'starLose');
  }
  update(win){
    if(win)
      this.star.loadTexture("starWin");
    else
      this.star.loadTexture("starLose");
  }
}


var playGame = {
  preload: function() {
    this.maxPlayers = 4;
    this.maxRounds = 5;
    this.nCards = 0;
    this.foo = false;
    game.config.setForceTimeOut = true;
    game.stage.disableVisibilityChange = true;

    game.load.image('table', 'assets_ico/mesa_ico.png');
    game.load.image('mplayers', 'assets_ico/hombre_avatar_ico.png');
    game.load.image('wplayers', 'assets_ico/avatar_hombre_ico.png');
    game.load.image('fplayer', 'assets_ico/jugador_principal_ico.png');
    game.load.image('starWin', 'assets_ico/star_ganador_ico.png');
    game.load.spritesheet('buttonR', 'assets_ico/btn_red_ico.png', 72, 42, 1);
    game.load.spritesheet('buttonB', 'assets_ico/btn_black_ico.png', 72, 42, 1);
    game.load.image('starLose', 'assets_ico/star_perdedor_ico.png');
    game.load.image('mSmall', 'assets_ico/hombre_small_ico.png');
    game.load.image('wSmall', 'assets_ico/mujer_small_ico.png');
    game.load.image('cardBack', 'assets_ico/carta_back_ico.png');
    game.load.image('coin', 'assets_ico/disponible_ico.png');
    game.load.image('dupTime', 'assets_ico/duplicar_tiempo_ico.png');

    for(var i = 0; i < 5; i++){
      game.load.image("card" + i, "assets_ico/carta_" + (i+1) + ".png");
    }
  },
  addSprite: function(posX, posY, spriteID, anchorX = 0, anchorY = 0, scale = false){
    var auxSprite = game.add.sprite(posX, posY, spriteID);
    auxSprite.anchor.set(anchorX, anchorY);
    if(scale)
      auxSprite.scale.set(scale);

    return auxSprite;
  },
  addText: function(posX, posY, text, anchorX = 0, scale = false){
    var auxText = game.add.text(posX, posY,text, { fontSize: '32px', fill: '#000' });
    auxText.anchor.set(anchorX,0);
    if(scale)
      auxText.scale.set(scale);

    return auxText;
  },
  addSuits: function(posX, posY, index){
    var auxSuit = game.add.button(posX, posY,'suits',this.pickSuit, this, index, index, index);
    auxSuit.scale.set(gameOptions.suitScale);
    auxSuit.anchor.set(0.5);
    auxSuit.variable = index;
    return auxSuit;
  },
  addStaticDraw: function(){
    game.stage.backgroundColor = 0x181818;
    var graphics = game.add.graphics(0, 0);

    graphics.beginFill(0x060606);
    graphics.drawRect(0, 791, 1133, 62);
    graphics.endFill();

    graphics.beginFill(0x0a0a0a);
    graphics.drawRoundedRect(40, 650, 300, 25, 18);
    graphics.endFill();

    graphics.beginFill(0xb30202,1);
    graphics.drawRoundedRect(424, 801, 170, 42, 7);
    graphics.endFill()
    graphics.lineStyle(1, 0xb30202);
    graphics.drawRoundedRect(624, 800, 274, 42, 7);
    graphics.drawRoundedRect(928, 800, 170, 42, 7);
    graphics.endFill();

    graphics.lineStyle(2, 0x202020);
    graphics.moveTo(622, 639); graphics.lineTo(622, 743);
    graphics.moveTo(246, 805); graphics.lineTo(246, 840);
    graphics.moveTo(609, 805); graphics.lineTo(609, 840);
    graphics.moveTo(913, 805); graphics.lineTo(913, 840);
    graphics.lineStyle(1, 0x000, 0);

    graphics.beginFill(0xd8d8d8, 1);
    graphics.drawCircle(this.playerArray[0].posX+34, this.playerArray[0].posY+39, 100);
    for(var i=1; i< this.maxPlayers; i++){
      graphics.drawCircle(this.playerArray[i].posX+24, this.playerArray[i].posY+27, 70);
    }
    for(var i=0; i< this.maxPlayers; i++){
      graphics.drawCircle(52.5, this.ratingPlayer[i]+10, 20);
    }
    graphics.endFill();
    
    graphics.lineStyle(1, 0xFFFFFF, 1);
    graphics.drawRoundedRect(539, 480, 67, 19, 4);
    graphics.drawRoundedRect(248, 355, 67, 19, 4);
    graphics.drawRoundedRect(541, 215, 67, 19, 4);
    graphics.drawRoundedRect(827, 355, 67, 19, 4);
  },
  addDinamicDraw: function(){
    this.stCircle = game.add.graphics(0,0);
    this.circleTimer = game.add.graphics(0, 0);
    graphics = game.add.graphics(0, 0);
    this.circleTimer.beginFill(0xffffff);
    this.circleTimer.drawCircle(689+23, 646, 46);
    this.circleTimer.endFill()
    game.world.bringToTop(this.circleTimer);
    graphics.drawRect(0, 791, 1133, 62);
    graphics.endFill();

    this.timerOn = true;
    this.playTime = 30;
    this.radialProgressBar = game.add.graphics(0, 0);
    this.timerBar = game.add.tween(angle).to( { max: 360 }, this.playTime*1000, "Linear", true, 0, 0, false);
    this.timerOn = true;
  },
  addStaticText: function(){
    var normalStyle = {fontSize: '12px', fill: '#FFF' ,fontWeight: 'normal' };
    game.add.text(693, 808, 'DUPLICAR TIEMPO DE JUGADA',{fontSize: '11px', fill: '#FFF' ,fontWeight: 'normal' });
    game.add.text(270, 808, 'MONTO DE INICIO DE PARTIDA',{fontSize: '9px', fill: '#FFF' ,fontWeight: 'normal' });
    game.add.text(94, 808, 'TIP DE SALA',{fontSize: '9px', fill: '#FFF' ,fontWeight: 'normal' });
    game.add.text(71, 628, 'RONDAS',{fontSize: '12px', fill: '#FFF' ,fontWeight: 'normal' });
    game.add.text(161, 628, '1',normalStyle);
    game.add.text(200, 628, '2',normalStyle);
    game.add.text(240, 628, '3',normalStyle);
    game.add.text(280, 628, '4',normalStyle);
    game.add.text(320, 628, '5',normalStyle);
  },
  addDinamicText: function(){
    this.turnText = game.add.text(754, 650,"",{fontSize: '20px', fill: '#c8c8c8',fontWeight:'normal'});
    this.turnText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    this.turnText2 = game.add.text(754, 674,"",{fontSize: '14px', fill: '#c8c8c8',fontWeight:'normal'});
  },
  create: function() {
    game.add.sprite(161,144,'table');
    this.posStarX = new Array(157, 197, 237, 277, 317);
    this.posStarY = new Array(655, 683, 711, 739);
    this.ratingPlayer = new Array(652, 679, 707, 735);
    this.ratingName = new Array(652, 679, 707, 735);

    this.cardArray = new Array(
      new cardGUI(362, 304),
      new cardGUI(444, 304),
      new cardGUI(526, 304),
      new cardGUI(608, 304),
      new cardGUI(690, 304)
    );
    this.cardArray[0].make();

    this.timerX;
    this.timerY;
    this.playerArray = new Array(
      new playerGUI(1, 532, 546),
      new playerGUI(2, 153, 337),
      new playerGUI(3, 547, 129),
      new playerGUI(4, 934, 337)
    );
    //for(var i = 0; i < this.maxPlayers ; i++){
    //  this.playerArray[i].init();
    //}
    this.addStaticDraw();
    this.addDinamicDraw();
    this.playerArray[0].init(true);
    this.playerArray[1].init(false);
    this.playerArray[2].init(false);
    this.playerArray[3].init(false);

    this.playerID = new Array(
      this.addText(game.width*0.2, game.height/2+55,'', 0.5),
      this.addText(game.width/2, game.height*0.15+55,'', 0.5),
      this.addText(game.width*0.8, game.height/2+55,'', 0.5),
      this.addText(game.width*0.8, game.height/2+55,'', 0.5)
    );
    var balanceStyle = { fontSize: '16px', fill: '#fff', fontWeight: 'normal' };
    this.balanceArray = new Array(
      game.add.text(560, 480,'', balanceStyle),
      game.add.text(269, 355,'', balanceStyle),
      game.add.text(562, 215,'', balanceStyle),
      game.add.text(848, 355,'', balanceStyle)
    );
    for(var i=0; i< this.maxPlayers; i++){
      this.balanceArray[i].text = 500;
    }

    this.addSprite(530, 479, 'coin');
    this.addSprite(239, 354, 'coin');
    this.addSprite(532, 214, 'coin');
    this.addSprite(818, 354, 'coin');
    this.addSprite(640, 809, 'dupTime');

    this.starsArray = new Array();
    for(var i = 0; i < this.posStarY.length; i++){
      for(var j = 0; j < this.posStarX.length; j++){
        this.starsArray.push(new starGUI(this.posStarX[j],this.posStarY[i]));
      }
    }

    this.nickName = new Array(
      game.add.text(0, 0,'Steeven\nCastellanos',{font: "bold 20px Arial",fill:"#68c9d2",boundsAlignH:"right", boundsAlignV:"middle" }),
      game.add.text(0, 0,'Fernando\nGonzalez',{font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"right", boundsAlignV:"middle" }),
      game.add.text(0, 0,'Lorena\nMijares',{font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"center", boundsAlignV:"middle" }),
      game.add.text(0, 0,'Ivan\nArazazu',{font: "bold 18px Arial",fill:"#bdbbbb",boundsAlignH:"left", boundsAlignV:"middle" })
    );

    this.nickName[0].setTextBounds(503, 644, 107, 50);
    this.nickName[1].setTextBounds(49, 342, 77, 46);
    this.nickName[2].setTextBounds(541, 21, 60, 46);
    this.nickName[3].setTextBounds(1015, 342, 77, 46);

    for(var i=0; i<this.maxPlayers; i++){
      this.updateStatus(i,0);
    }

    var starNickStyle = { fontSize: '12px', fill: '#bdbdbd', fontWeight: 'normal' };
    this.ratingNick = new Array(
      game.add.text(72, 655,'Steeven C.', starNickStyle),
      game.add.text(72, 682,'Fernando G.', starNickStyle),
      game.add.text(72, 710,'Lorena M.', starNickStyle),
      game.add.text(72, 738,'Ivan A.', starNickStyle)
    );

    this.pSmall = new Array(
      this.addSprite(46, 654, "mSmall"),
      this.addSprite(46, 681, "mSmall"),
      this.addSprite(46, 710, "wSmall"),
      this.addSprite(46, 737, "mSmall")
    );

    this.addStaticText();
    this.addDinamicText();
    game.time.events.add(Phaser.Timer.SECOND*5, function(){
      this.btnUpdate(btnEnum.PICK, true);
      this.timerOn = false;
      for(var i=0; i< 5; i++){
        this.cardArray[i].make();
        this.cardArray[i].flip(i,1,1);
      }
    }, this);
  
    var winArr = new Array(1,3);
    this.updateWinners("",0,winArr,0)
    var winArr1 = new Array(0,1,3);
    this.updateWinners("",0,winArr1,4)
  },
  updateStatus: function(player, status){
    var posX, posY;
    if(status == 0){
      this.stCircle.beginFill(0x7ed321);
    }else if(status == 1){
      this.stCircle.beginFill(0xf5a623);
    }else if(status == 2){
      this.stCircle.beginFill(0xb30202);
    }
    if(player == 0){
      posX=488; posY=651;
    }else if(player == 1){
      posX=34; posY=349;
    }else if(player == 2){
      posX=526; posY=28;
    }else if(player == 3){
      posX=1000; posY=350;
    }
    this.stCircle.drawCircle(posX, posY,10);
    this.stCircle.endFill();

  },
  suitRequest: function(){
    this.readyText.destroy();
    this.suitText.text = '¡Pick a Suit!'
    for(var i = 0; i<4 ; i++){
      this.suits.push(this.addSuits(game.width*(0.35 + i*0.1), game.height/2,i));
    }
  },
  readyPlayer: function(){
    this.readyText.text = 'Waiting for other Players';
    socket.emit('ready', socket.id);
    this.buttonReady.destroy();
  },
  pickSuit: function(item){
    if(item.variable == 0){
      console.log('Picked: CLUBS');
      socket.emit('suit', 'Clubs', socket.id);
    }
    if(item.variable == 1){
      console.log('Picked: SPADES');
      socket.emit('suit', 'Spades', socket.id);
    }
    if(item.variable == 2){
      console.log('Picked: HEARTS');
      socket.emit('suit', 'Hearts', socket.id);
    }
    if(item.variable == 3){
      console.log('Picked: DIAMONDS');
      socket.emit('suit', 'Diamonds', socket.id);
    }
    for(var i=0; i<4; i++){
      if(i!=item.variable)
        this.suits[i].destroy();
    }
  },
  pickedSuit: function(suitIndex){
    game.time.events.add(Phaser.Timer.SECOND*2, function(){
      this.suits[suitIndex].destroy();
    }, this) 
    var fadeTween = game.add.tween(this.suits[suitIndex]).to({
      alpha: 0
    }, 500, Phaser.Easing.Linear.None, true);
  },
  btnUpdate: function(btn, display){
    if(btn == 0){
      if(display){
        this.turnText.text = "YOUR TURN";
        this.turnText2.text = "Pick a color:";
        buttonR = game.add.button(754, 705, 'buttonR', this.onClickR, this, 0, 0, 0);
        buttonB = game.add.button(832, 705, 'buttonB', this.onClickB, this, 0, 0, 0);    
        buttonR.input.useHandCursor = true;
        buttonB.input.useHandCursor = true;
      }else{
        this.turnText.text = '';
        this.turnText2.text = '';
        buttonR.destroy();
        buttonB.destroy();
      }
    }else if(btn == 1){
      if(display){
        poolYes = game.add.button(game.width*0.65, game.height*0.8, 'poolR', this.poolAccept, this, 0, 0, 0);
        poolNo = game.add.button(game.width*0.35, game.height*0.8, 'poolR', this.poolDenied, this, 1, 1, 1);    
        poolYes.anchor.set(0.5);
        poolNo.anchor.set(0.5);
        poolYes.scale.set(0.35);
        poolNo.scale.set(0.35);
        poolYes.input.useHandCursor = true;
        poolNo.input.useHandCursor = true;
      }else{
        this.poolText.text = '';
        poolYes.destroy();
        poolNo.destroy();
      }
    }else if(btn == 2){
      if(display){

      }else{
        
      }
    }
  },
  onClickR: function(){
    this.btnUpdate(btnEnum.PICK, false);
    console.log("RED BUTTON");
    //socket.emit('getPlay', true);
  },
  onClickB: function(){
    this.timerBar.stop();
    this.timerOn = false;
    this.circleTimer.destroy()
    this.btnUpdate(btnEnum.PICK, false);
    //socket.emit('getPlay', false);
    console.log("BLACK BUTTON");
  },
  poolRequest: function(req){
    this.btnUpdate(btnEnum.POOL, true);
  },
  poolAccept: function(){
    this.btnUpdate(btnEnum.POOL, false);
   socket.emit('getPoolAnswer', true, socket.id);
  },
  poolDenied: function(){
    this.btnUpdate(btnEnum.POOL, false);
    socket.emit('getPoolAnswer', false, socket.id);
  },
  alertTurn: function(select, playerIndex, playerText, time){
    this.suitText.text = '';
    this.playTime = time;
    this.timerBar = game.add.tween(angle).to( { max: 360 }, this.playTime, "Linear", true, 0, 0, false);
    this.timerOn = true;
    this.timerBar.onComplete.add(function(){
      this.timerOn = false;
      this.radialProgressBar.clear();
    }, this);
    this.timerX = this.playerArray[playerIndex].posX;
    this.timerY = this.playerArray[playerIndex].posY;
    //this.playerArray[playerIndex].alert(true);
    this.btnUpdate(btnEnum.PICK, true);
  },
  checkPlayer: function(playerIndex, color){
    this.timerOn = false;
    this.timerBar.stop();
    angle.max = 0;
    this.btnUpdate(btnEnum.PICK, false);
    this.radialProgressBar.clear();
    //this.playerArray[playerIndex].check(color, true);
    //this.playerArray[playerIndex].alert(false);
  },
  showCard: function(card, suit) {
    this.cardArray[this.nCards].flip(card, gameOptions.flipZoom, gameOptions.cardScaleOn);
    this.printWinColor(card);
    this.cardArray[this.nCards].move(true, 0,0);
    this.nCards++;
    this.cardArray.push(new cardGUI());
    if(this.nCards!=this.maxRounds){
      this.cardArray[this.nCards].make();
    }
    //game.time.events.add(Phaser.Timer.SECOND*time, this.cardArray[nCards].move, this);
    //this.cardArray[nCards].move();
    this.colorText.text = '';
  },
  showFirst: function(card){
    this.printWinSuit(card.suit);
    this.cardArray[this.nCards].make();
    this.firstCard.flip(card, 1, 1.4);
    this.firstCard.move(true,0,0);
    game.time.events.add(Phaser.Timer.SECOND*2, function(){
      this.firstCard.fade();
    }, this) 
  },
  printWinColor: function(card) {
    this.nameText.text = '';
    if(card.color){
      this.colorText.text = '¡RED!';
    }
    else{
      this.colorText.text = '¡BLACK!';
    }
  },
  printWinSuit: function(suit){
    this.suitText.text = '¡'+suit+'!'
    if(suit == 0)
      console.log('CLUBS');
    if(suit == 0)
      console.log('CLUBS');
    if(suit == 0)
      console.log('CLUBS');
    if(suit == 0)
      console.log('CLUBS');
  },
  updateWinners: function(winText, prize, winners, round){
    if(prize != 0){
      //this.winnerText.text = winText +''+ prize;
    }
    else{
      //this.winnerText.text = winText;
    }
    for(var i = 0; i<winners.length; i++){
      this.starsArray[winners[i]*5+round].update(true);
    }
  },
  updateBalane: function(balance){
    for(var i = 0; i< balance.length ; i++)
    this.balanceText[i].text = balance[i];
  },
  updateRound: function(roundNumber){
    this.suitText.text = '';
    this.roundText.text = 'Round: '+ roundNumber;
    if(roundNumber>1)
      for(var i =0; i<this.maxPlayers; i++){
        this.playerArray[i].check(0, false);
      }
  },
  //nickName: function(names){
  //  for(var i = 0; i<names.length();i++){
  //    this.playerID[i].text = names[i];
  //  }
  //},
  alertTimer: function(){
    if(this.timerOn){
      this.radialProgressBar.clear();
      this.radialProgressBar.lineStyle(alertWidth, 0x77e5f0);

      this.radialProgressBar.lineColor = Phaser.Color.interpolateColor(color1, color2, 360, angle.max, 1);

      this.radialProgressBar.arc(712, 646, 26, angle.min, game.math.degToRad(angle.max), false);
      this.radialProgressBar.endFill();
    }else{
      this.radialProgressBar.clear(); 
    }
  },
  update: function(){
    this.alertTimer();
  }
}