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

class balanceGUI {
  constructor(posX, posY, balance){
    this.posX = posX;
    this.posY = posY;
    this.balance = game.add.text(posX, posY,'', { fontSize: '18px', fill: '#fff', fontStyle:'italic' });
  }
  update(balance){
    this.balance.text = balance;
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
    game.load.image('starLose', 'assets_ico/star_perdedor_ico.png');
    game.load.image('mSmall', 'assets_ico/hombre_small_ico.png');
    game.load.image('wSmall', 'assets_ico/mujer_small_ico.png');
    game.load.image('cardBack', 'assets_ico/carta_back_ico.png');

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
  create: function() {
    game.add.sprite(161,144,'table');
    game.stage.backgroundColor = 0x181818;
    var graphics = game.add.graphics(0, 0);
    var circleTimer = game.add.graphics(0,0);
    this.posStarX = new Array(157, 197, 237, 277, 317);
    this.posStarY = new Array(655, 683, 711, 739);

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
      new playerGUI(2, 153.5, 337.5),
      new playerGUI(3, 547, 129),
      new playerGUI(4, 934, 337)
    );
    //for(var i = 0; i < this.maxPlayers ; i++){
    //  this.playerArray[i].init();
    //}
    this.playerArray[0].init(true);
    this.playerArray[1].init(false);
    this.playerArray[2].init(false);
    this.playerArray[3].init(false);

    this.playerID = new Array(
      this.addText(game.width*0.2, game.height/2+55,'', 0.5),
      this.addText(game.width/2, game.height*0.15+55,'', 0.5),
      this.addText(game.width*0.8, game.height/2+55,'', 0.5)
    );

    this.balanceArray = new Array(
      new balanceGUI(560, 478),
      new balanceGUI(269, 353),
      new balanceGUI(562, 213),
      new balanceGUI(848, 353),
    );
    for(var i=0; i< this.maxPlayers; i++){
      this.balanceArray[i].update(500);
    }

    this.starsArray = new Array();
    for(var i = 0; i < this.posStarY.length; i++){
      for(var j = 0; j < this.posStarX.length; j++){
        this.starsArray.push(new starGUI(this.posStarX[j],this.posStarY[i]));
      }
    }

    graphics.beginFill(0xd8d8d8, 1);
    graphics.drawCircle(this.playerArray[0].posX+33, this.playerArray[0].posY+44, 100);
    for(var i=1; i< this.maxPlayers; i++){
      graphics.drawCircle(this.playerArray[i].posX+23, this.playerArray[i].posY+30, 70);
    }
    graphics.endFill()
    circleTimer.beginFill(0xffffff, 1);
    circleTimer.drawCircle(689+23, 646, 46);
    circleTimer.endFill()
    game.world.bringToTop(circleTimer);

    this.pSmall = new Array(
      this.addSprite(46, 654, "mSmall"),
      this.addSprite(46, 681, "mSmall"),
      this.addSprite(46, 710, "wSmall"),
      this.addSprite(46, 737, "mSmall")
    );
    this.timerOn = true;
    this.playTime = 5;
    this.radialProgressBar = game.add.graphics(0, 0);
    this.timerBar = game.add.tween(angle).to( { max: 360 }, this.playTime*1000, "Linear", true, 0, -1, false);
    this.timerOn = true;
    game.time.events.add(Phaser.Timer.SECOND*5, function(){
      for(var i=0; i< 5; i++){
        this.cardArray[i].make();
        this.cardArray[i].flip(i,1,1);
      }
    }, this);
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
  disableButtons: function(){
    this.auxR.destroy();
    this.auxB.destroy();
    buttonR.destroy();
    buttonB.destroy();
    buttonR.inputEnabled = false;
    buttonB.inputEnabled = false;
  },
  onClickR: function(){
    this.disableButtons();
    console.log("RED BUTTON");
    socket.emit('getPlay', true);
  },
  onClickB: function(){
    this.disableButtons();
    socket.emit('getPlay', false);
    console.log("BLACK BUTTON");
  },
  poolRequest: function(req){
    if(req){
      this.poolText.text = 'Accumulate Bet?'
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
  },
  poolAccept: function(){
   this.poolRequest(false);
   socket.emit('getPoolAnswer', true, socket.id);
  },
  poolDenied: function(){
    this.poolRequest(false);
    socket.emit('getPoolAnswer', false, socket.id);
  },
  alertTurn: function(select, playerIndex, playerText, time){
    this.winnerText.text = '';
    this.colorText.text = '';
    this.suitText.text = '';
    this.nameText.text = playerText;

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
    if(select){
      this.auxR = this.addSprite(game.width/2 - 100, game.height*0.9,'ButtonR',0.5,0.5,gameOptions.buttonScale);
      this.auxB = this.addSprite(game.width/2 + 100, game.height*0.9,'ButtonB',0.5,0.5,gameOptions.buttonScale);
      buttonR = game.add.button(game.width/2 - 100, game.height*0.9, 'buttonR', this.onClickR, this, 0, 0, 0);
      buttonB = game.add.button(game.width/2 + 100, game.height*0.9, 'buttonB', this.onClickB, this, 0, 0, 0);    
      buttonR.anchor.set(0.5);
      buttonB.anchor.set(0.5);
      buttonR.inputEnabled = true;
      buttonB.inputEnabled = true;
      buttonR.input.useHandCursor = true;
      buttonB.input.useHandCursor = true;
    }
  },
  checkPlayer: function(playerIndex, color){
    this.timerOn = false;
    this.timerBar.stop();
    angle.max = 0;
    this.radialProgressBar.clear();
    this.playerArray[playerIndex].check(color, true);
    this.playerArray[playerIndex].alert(false);
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
    this.winnerText.text = '';
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
  updateWinners: function(winText, prize){
    if(prize != 0){
      this.winnerText.text = winText +''+ prize;
    }
    else{
      this.winnerText.text = winText;
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
  nickName: function(names){
    for(var i = 0; i<names.length();i++){
      this.playerID[i].text = names[i];
    }
  },
  alertTimer: function(){
    if(this.timerOn){
      this.radialProgressBar.clear();
      this.radialProgressBar.lineStyle(alertWidth, 0x77e5f0);

      this.radialProgressBar.lineColor = Phaser.Color.interpolateColor(color1, color2, 360, angle.max, 1);

      this.radialProgressBar.arc(712, 646, 26, angle.min, game.math.degToRad(angle.max), false);
      this.radialProgressBar.endFill();
    }
  },
  update: function(){
    this.alertTimer();
  }
}