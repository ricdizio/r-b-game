var game;

var gameOptions = {
  gameWidth: 1260,
  gameHeight: 600,
  cardSheetWidth: 65,
  cardSheetHeight: 81,
  cardScaleOff: 0.5,
  cardScaleOn: 2,
  circleScale: 0.4,
  alertScale: 0.5,
  checkScale: 0.4,
  buttonScale: 0.1,
  flipZoom: 1.2,
  flipSpeed: 300
}

window.onload = function() {
  game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
  game.state.add("PlayGame", playGame);
  game.state.start("PlayGame");
}
var aux;

class cardGUI {
  constructor(){
    this.update = false;
  }
  make(posX, posY, sprite){
    this.card = game.add.sprite(game.width / 2, game.height*3/4, sprite, 0);
    this.card.animations.updateIfVisible = this.update;
    this.card.anchor.set(0.5);
    this.card.scale.set(gameOptions.cardScaleOff);
    this.card.isFlipping = false;
  }
  flip(card){
    this.card.isFlipping = true;
    flipTween = game.add.tween(this.card.scale).to({
      x: 0,
      y: gameOptions.flipZoom
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
    flipTween.onComplete.add(function(){
      this.card.loadTexture('card'+card.index);
      backFlipTween.start();
    }, this);
    backFlipTween = game.add.tween(this.card.scale).to({
      x: gameOptions.cardScaleOn,
      y: gameOptions.cardScaleOn
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
    
    backFlipTween.onComplete.add(function(){
      this.card.isFlipping = false;
    }, this);
    this.move(0, game.height / 2, 2);
  }
  move(posX=0, posY=0, time){
    var moveDownTween = game.add.tween(spriteCard).to({
      x: posX,
      y: posY
    }, 500, Phaser.Easing.Cubic.Out, true);
    game.time.events.add(Phaser.Timer.SECOND*time, this.fade, this);
  }
  fade(){
    for(var i = 0; i < 2; i++){
      var fadeTween = game.add.tween(this.card).to({
          alpha: 0
      }, 500, Phaser.Easing.Linear.None, true);
    }
    game.time.events.add(Phaser.Timer.SECOND, function(){
    }, this) 
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
    this.circleTurn = game.add.sprite(this.posX, this.posY, 'circle');
    this.circleTurn.scale.set(gameOptions.circleScale);
    this.circleTurn.anchor.set(0.5);
  }
  check(color, bool){
    if(bool){
      this.checkSprite = game.add.sprite(this.posX, this.posY, 'check'+color);
      this.checkSprite.anchor.set(0.5);
      this.checkSprite.scale.set(gameOptions.checkScale);
    }
    else{
      this.checkSprite.destroy();
    }
  }
  alert(bool){
    if(bool){
      alert = game.add.sprite(this.posX, this.posY, 'alert');
      alert.scale.set(gameOptions.alertScale);
      alert.anchor.set(0.5);
    } else{
      alert.destroy();
    }
  }
}

var playGame = {
  preload: function() {
    this.maxPlayers = 3;
    game.stage.disableVisibilityChange = true;
    game.load.image('table', 'assets/table.png');
    game.load.image('circle', 'assets/circle.png');
    game.load.image('checkRed', 'assets/checkRed.png');
    game.load.image('checkBlack', 'assets/checkBlack.png');
    game.load.image('ButtonR', 'assets/buttonR.png');
    game.load.image('ButtonB', 'assets/buttonB.png');
    game.load.image('alert', 'assets/turnAlert.png');
    game.load.spritesheet('flip', 'assets/flip.png', 167, 243);
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
    var auxText;
    auxText = game.add.text(posX, posY,text, { fontSize: '32px', fill: '#000' });
    auxText.anchor.set(anchorX,0);
    if(scale)
      auxText.scale.set(scale);

    return auxText;
  },
  create: function() {
    game.add.sprite(0,0,'table');
    //spriteCard = this.makeCard();
    spriteCard = new cardGUI();
    spriteCard.make(game.width / 2, game.height*3/4, 'flip')
    
    this.playerArray = new Array(
      new playerGUI(1, game.width*0.2, game.height/2),
      new playerGUI(2, game.width/2,   game.height*0.15),
      new playerGUI(3, game.width*0.8, game.height/2)
    );

    for(var i = 0; i < this.maxPlayers ; i++){
      this.playerArray[i].init();
    }
    this.playerArray[0].alert(true);

    this.addSprite(game.width/2 - 100, game.height*0.9,'ButtonR',0.5,0.5,gameOptions.buttonScale);
    this.addSprite(game.width/2 + 100, game.height*0.9,'ButtonB',0.5,0.5,gameOptions.buttonScale);
    
    buttonR = game.add.button(game.width/2 - 100, game.height*0.9, 'buttonR', this.onClickR, this, 0, 0, 0);
    buttonB = game.add.button(game.width/2 + 100, game.height*0.9, 'buttonB', this.onClickB, this, 0, 0, 0);    
    buttonR.anchor.set(0.5);
    buttonB.anchor.set(0.5);

    this.nameText = this.addText(game.width/2, game.height/3,'',0.5);
    this.colorText = this.addText(game.width/2, game.height/3,'',0.5);
    this.roundText = this.addText(20, game.height-40,'Round: 0');
    this.winnerText = this.addText(game.width/2, 20,'',0.5);
    balanceText = new Array(
      this.addText(game.width*0.12, game.height/2,'500', 0.5),
      this.addText(game.width/2-100, game.height*0.15,'500', 0.5),
      this.addText(game.width*0.72, game.height/2,'500', 0.5)
    );
  },
  onClickR: function(){
    console.log("RED BUTTON");
    socket.emit('getPlay', true);
  },
  onClickB: function(){
    socket.emit('getPlay', false);
    console.log("BLACK BUTTON");
  },
  alertTurn: function(playerIndex, playerText){
    this.nameText.text = playerText;
    this.winnerText.text = '';
    this.playerArray[playerIndex].alert(true);
  },
  checkPlayer: function(playerIndex, color, card){
    this.playerArray[playerIndex].check(color, true);
    this.playerArray[playerIndex].alert(false);
  },
  showCard: function(card) {
    spriteCard.flip(card);
    this.printWinColor(card);
    spriteCard.move();

    for(var i = 0; i<this.maxPlayers; i++){
      this.playerArray[i].check(0, false);
      this.playerArray[i].alert(false);
    }
    this.colorText.text = '';
    this.winnerText.text = '';
    /*flipTween = game.add.tween(spriteCard.scale).to({
      x: 0,
      y: gameOptions.flipZoom
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

    flipTween.onComplete.add(function(){
      spriteCard.loadTexture('card'+card.index);
      backFlipTween.start();
    }, this);
    backFlipTween = game.add.tween(spriteCard.scale).to({
      x: gameOptions.cardScaleOn,
      y: gameOptions.cardScaleOn
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
    
    backFlipTween.onComplete.add(function(){
      spriteCard.isFlipping = false;
    }, this);

    if(!spriteCard.isFlipping){
      this.moveCards();
      spriteCard.isFlipping = true;
      flipTween.start();
      this.winColor(card);
    }*/
  },
  printWinColor: function(card) {
    nameText.text = '';
    if(card.color){
      this.colorText.text = '¡RED!';
    }
    else{
      this.colorText.text = '¡BLACK!';
    }
  },
  updateWinners: function(winText, prize, balance, houseWon){
    if(!houseWon){
      if(prize != 0){
        winnerText.text = winText +''+ prize;
      }
      else{
        winnerText.text = winText;
      }
    }
    else{
      winnerText.text = winText;
    }
    for(var i = 0; i< balance.length ; i++)
      balanceText[0].text = balance[0];
  },
  updateRound: function(roundNumber){
    this.roundText.text = 'Round: '+ roundNumber;
  },
  moveCards: function() {
    var moveDownTween = game.add.tween(spriteCard).to({
      y: game.height / 2
    }, 500, Phaser.Easing.Cubic.Out, true);
    game.time.events.add(Phaser.Timer.SECOND*2, this.fadeCards, this);
  },
  fadeCards: function(){
    for(var i = 0; i < 2; i++){
      var fadeTween = game.add.tween(spriteCard).to({
          alpha: 0
      }, 500, Phaser.Easing.Linear.None, true);
    }
    for(var i = 0; i<this.maxPlayers; i++){
      this.playerArray[i].check(0, false);
      this.playerArray[i].alert(false);
    }
    this.colorText.text = '';
    this.winnerText.text = '';
    game.time.events.add(Phaser.Timer.SECOND, function(){
      spriteCard.destroy();
      spriteCard = this.makeCard();
    }, this) 
  }
}
