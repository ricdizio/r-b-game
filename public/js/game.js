var game;

var gameOptions = {
  gameWidth: 900,
  gameHeight: 600,
  cardSheetWidth: 65,
  cardSheetHeight: 81,
  cardScaleOff: 0.5,
  cardScaleOn: 1.2,
  circleScale: 0.4,
  alertScale: 0.45,
  checkScale: 0.4,
  buttonScale: 0.1,
  suitScale: 0.2,
  flipZoom: 0.65,
  flipSpeed: 500
}

window.onload = function() {
  game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeigh, Phaser.AUTO, 'phaser-game');
  game.state.add("PlayGame", playGame);
  game.state.start("PlayGame");
}

var angle = { min: 0, max: 0 };
var color2 = 0xff0000;
var color1 = 0x80ff00;
var alertWidth = 12

class cardGUI {
  constructor(posX, posY){
    this.update = false;
    this.posX = posX;
    this.posY = posY;
  }
  make(){
    this.card = playGame.addSprite(game.width / 2, game.height*3/4, 'flip', 0.5, 0.5, gameOptions.cardScaleOff);
    this.card.animations.updateIfVisible = this.update;
    this.card.isFlipping = false;
  }
  flip(card, zoom, size){
    this.card.isFlipping = true;

    var flipTween = game.add.tween(this.card.scale).to({
      x: 0,
      y: zoom, //gameOptions.flipZoom
    }, gameOptions.flipSpeed, Phaser.Easing.Linear.None);

    flipTween.onComplete.add(function(){
      this.card.loadTexture('card'+card.index);
      this.card.scale.set(size*1.05);
      backFlipTween.start();
    }, this);

    var backFlipTween = game.add.tween(this.card.scale).to({
      x: size,//gameOptions.cardScaleOn,
      y: size, //gameOptions.cardScaleOn
    }, gameOptions.flipSpeed , Phaser.Easing.Linear.None);
    
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
  init(){
    this.circleTurn = playGame.addSprite(this.posX, this.posY, 'circle', 0.5, 0.5, gameOptions.circleScale);
  }
  check(color, bool){
    if(bool){
      this.checkSprite = playGame.addSprite(this.posX, this.posY, 'check'+color, 0.5, 0.5, gameOptions.checkScale);
    }
    else{
      this.checkSprite.destroy();
    }
  }
  pick(suitIndex, bool){
    if(bool)
      this.suit = playGame.addSuits(this.posX, this.posY, suitIndex, 0.12);
    else
      this.suit.destroy();
  }
  alert(bool){
    if(bool){
      this.alertSprite = playGame.addSprite(this.posX, this.posY,'alert', 0.5, 0.5, gameOptions.alertScale);
    } else{
      this.alertSprite.destroy();
    }
  }
}

var playGame = {
  preload: function() {
    this.maxPlayers = 3;
    this.maxRounds = 5;
    this.nCards = 0;
    this.foo = false;
    game.config.setForceTimeOut = true;
    game.stage.disableVisibilityChange = true;

    game.load.image('table', 'assets/table.png');
    game.load.image('circle', 'assets/circle.png');
    game.load.image('checkRed', 'assets/checkRed.png');
    game.load.image('checkBlack', 'assets/checkBlack.png');
    game.load.image('ButtonR', 'assets/buttonR.png');
    game.load.image('ButtonB', 'assets/buttonB.png');
    game.load.image('alert', 'assets/turnAlert.png');
    game.load.spritesheet('flip', 'assets/flip.png', 167, 243);
    game.load.spritesheet('suits', 'assets/suits.png',500,550);
    game.load.spritesheet('ready', 'assets/ready.png',318,318);
    game.load.spritesheet('poolR', 'assets/yesno.png',358,313);
    for(var i = 0; i < 52; i++){
      game.load.image("card" + i, "assets/card" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
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
  addSuits: function(posX, posY, index, scale = gameOptions.suitScale){
    var auxSuit = game.add.button(posX, posY,'suits',this.pickSuit, this, index, index, index);
    auxSuit.scale.set(scale);
    auxSuit.anchor.set(0.5);
    auxSuit.variable = index;
    return auxSuit;
  },
  create: function() {
    game.add.sprite(0,0,'table');

    this.cardArray = new Array(
      new cardGUI(game.width*0.325, game.height/2),
      new cardGUI(game.width*0.4125, game.height/2),
      new cardGUI(game.width*0.5, game.height/2),
      new cardGUI(game.width*0.5875, game.height/2),
      new cardGUI(game.width*0.675, game.height/2)
    );

    this.firstCard = new cardGUI(game.width/2, game.height/2);
    this.firstCard.make();

    this.timerX;
    this.timerY;
    this.playerArray = new Array(
      new playerGUI(1, game.width*0.2, game.height/2),
      new playerGUI(2, game.width/2,   game.height*0.15),
      new playerGUI(3, game.width*0.8, game.height/2)
    );
    for(var i = 0; i < this.maxPlayers ; i++){
      this.playerArray[i].init();
    }

    this.playerID = new Array(
      this.addText(game.width*0.2, game.height/2+55,'', 0.5),
      this.addText(game.width/2, game.height*0.15+55,'', 0.5),
      this.addText(game.width*0.8, game.height/2+55,'', 0.5)
    );

    this.balanceText = new Array(
      this.addText(game.width*0.2, game.height/2+85,'500', 0.5),
      this.addText(game.width/2, game.height*0.15+85,'500', 0.5),
      this.addText(game.width*0.8, game.height/2+85,'500', 0.5)
    );
    
    this.nameText = this.addText(game.width/2, game.height/3,'',0.5);
    this.colorText = this.addText(game.width/2, game.height/3,'',0.5);
    this.roundText = this.addText(20, game.height-40,'Round: 0');
    this.winnerText = this.addText(game.width/2, 15,'',0.5);
    this.poolText = this.addText(game.width/2, game.height*0.35+5,'',0.5);
    this.suitText = this.addText(game.width/2, game.height*0.35+5,'',0.5);
    this.readyText = this.addText(game.width/2, game.height*0.35+5,'Ready?',0.5);
    this.suits = new Array();

    this.buttonReady = game.add.button(game.width/2, game.height/2, 'ready', this.readyPlayer, this, 0, 0, 0);
    this.buttonReady.scale.set(0.35);
    this.buttonReady.anchor.set(0.5, 0.5);

    this.radialProgressBar = game.add.graphics(0, 0);
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
    this.buttonOn = false;
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

    this.timerBar = game.add.tween(angle).to( { max: 360 }, time, "Linear", true, 0, 0, false);
    this.timerOn = true;
    this.timerBar.onComplete.add(function(){
      this.timerOn = false;
      this.radialProgressBar.clear();
    }, this);
    this.timerX = this.playerArray[playerIndex].posX;
    this.timerY = this.playerArray[playerIndex].posY;
    //this.playerArray[playerIndex].alert(true);
    if(select){
      this.buttonOn = true;
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
    if(this.buttonOn){
      this.disableButtons();
    }
    this.timerOn = false;
    this.timerBar.stop();
    angle.max = 0;
    this.radialProgressBar.clear();
    this.playerArray[playerIndex].check(color, true);
    //this.playerArray[playerIndex].alert(false);
  },
  checkSuit: function(suit, playerIndex){
    this.playerArray[playerIndex].pick(suit, true);
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
    this.firstCard.flip(card, 0.6, 1.4);
    this.firstCard.move(true,0,0);
    game.time.events.add(Phaser.Timer.SECOND*2, function(){
      this.firstCard.fade();
      for(var i=0; i<3; i++){
        this.playerArray[i].pick(false, false);
      }
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
    for(var i = 0; i < names.length; i++){
      if(names[i])
        this.playerID[i].text = names[i];
    }
  },
  alertTimer: function(){
    if(this.timerOn){
      this.radialProgressBar.clear();
      this.radialProgressBar.lineStyle(alertWidth, 0xffffff);

      this.radialProgressBar.lineColor = Phaser.Color.interpolateColor(color1, color2, 360, angle.max, 1);

      this.radialProgressBar.arc(this.timerX, this.timerY, 55, angle.min, game.math.degToRad(angle.max), false);
      this.radialProgressBar.endFill();
    }
  },
  update: function(){
    this.alertTimer();
  }
}