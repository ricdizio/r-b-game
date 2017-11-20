var game;

var gameOptions = {
  gameWidth: 1260,
  gameHeight: 600,
  cardSheetWidth: 65,
  cardSheetHeight: 81,
  cardScaleOff: 0.5,
  cardScaleOn: 1.7,
  circleScale: 0.4,
  alertScale: 0.45,
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
  constructor(posX, posY){
    this.update = false;
    this.posX = posX;
    this.posY = posY;
  }
  make(){
    this.card = game.add.sprite(game.width / 2, game.height*3/4, 'flip', 0);
    this.card.animations.updateIfVisible = this.update;
    this.card.anchor.set(0.5);
    this.card.scale.set(gameOptions.cardScaleOff);
    this.card.isFlipping = false;
  }
  flip(card){
    this.card.isFlipping = true;

    var flipTween = game.add.tween(this.card.scale).to({
      x: 0,
      y: gameOptions.flipZoom
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

    flipTween.onComplete.add(function(){
      this.card.loadTexture('card'+card.index);
      backFlipTween.start();
    }, this);

    var backFlipTween = game.add.tween(this.card.scale).to({
      x: gameOptions.cardScaleOn,
      y: gameOptions.cardScaleOn
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
    
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
    //game.time.events.add(Phaser.Timer.SECOND*time, this.fade, this);
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
      this.alertSprite = game.add.sprite(this.posX, this.posY, 'alert');
      this.alertSprite.scale.set(gameOptions.alertScale);
      this.alertSprite.anchor.set(0.5);
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
    game.stage.disableVisibilityChange = true;
    // FICHAAAAAA
    // game.load.image('ID', 'ruta/archivo.png');
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

    this.cardArray = new Array(
      new cardGUI(game.width*0.325, game.height/2),
      new cardGUI(game.width*0.4125, game.height/2),
      new cardGUI(game.width*0.5, game.height/2),
      new cardGUI(game.width*0.5875, game.height/2),
      new cardGUI(game.width*0.675, game.height/2)
    );
    this.cardArray[this.nCards].make();

    this.playerArray = new Array(
      new playerGUI(1, game.width*0.2, game.height/2),
      new playerGUI(2, game.width/2,   game.height*0.15),
      new playerGUI(3, game.width*0.8, game.height/2)
    );
    for(var i = 0; i < this.maxPlayers ; i++){
      this.playerArray[i].init();
    }

    this.balanceText = new Array(
      this.addText(game.width*0.2, game.height/2+60,'500', 0.5),
      this.addText(game.width/2, game.height*0.15+60,'500', 0.5),
      this.addText(game.width*0.8, game.height/2+60,'500', 0.5)
    );
    // AÑADIR AL JUEGO FICHAAAA
    // this.addsprite(POSX, POSY, 'ID', coordenada referencia X, coordref Y, escalar imagen);
    
    this.nameText = this.addText(game.width/2, game.height/3-5,'',0.5);
    this.colorText = this.addText(game.width/2, game.height/3,'',0.5);
    this.roundText = this.addText(20, game.height-40,'Round: 0');
    this.winnerText = this.addText(game.width/2, 15,'',0.5);
    this.poolText = this.addText(game.width/2, game.height*0.3,'',0.5);
  },
  onClickR: function(){
    this.auxR.destroy();
    this.auxB.destroy();
    buttonR.destroy();
    buttonB.destroy();
    console.log("RED BUTTON");
    socket.emit('getPlay', true);
  },
  onClickB: function(){
    this.auxR.destroy();
    this.auxB.destroy();
    buttonR.destroy();
    buttonB.destroy();
    socket.emit('getPlay', false);
    console.log("BLACK BUTTON");
  },
  poolRequest: function(req){
    if(req){
      this.poolText.text = 'Accumulate Bet?'
      poolYes = game.add.button(game.width/2 - 100, game.height*0.8, 'poolY', this.poolAccept, this, 0, 0, 0);
      poolNo = game.add.button(game.width/2 + 100, game.height*0.8, 'poolN', this.poolDenied, this, 0, 0, 0);    
      poolYes.anchor.set(0.5);
      poolNo.anchor.set(0.5);
      poolYes.input.useHandCursor = true;
      poolNo.input.useHandCursor = true;
    }else{
      this.poolText.text = '';
      this.poolYes.destroy();
      this.poolNo.destroy();
    }
  },
  poolAccept: function(){
   this.poolRequest(false);
   socket.emit('poolReq', true);
  },
  poolDenied: function(){
    this.poolRequest(false);
    socket.emit('poolRes', false);
  },
  alertTurn: function(select, playerIndex, playerText){
    this.winnerText.text = '';
    this.colorText.text = '';
    this.nameText.text = playerText;
    this.playerArray[playerIndex].alert(true);
    if(select){
      this.auxR = this.addSprite(game.width/2 - 100, game.height*0.9,'ButtonR',0.5,0.5,gameOptions.buttonScale);
      this.auxB = this.addSprite(game.width/2 + 100, game.height*0.9,'ButtonB',0.5,0.5,gameOptions.buttonScale);
      buttonR = game.add.button(game.width/2 - 100, game.height*0.9, 'buttonR', this.onClickR, this, 0, 0, 0);
      buttonB = game.add.button(game.width/2 + 100, game.height*0.9, 'buttonB', this.onClickB, this, 0, 0, 0);    
      buttonR.anchor.set(0.5);
      buttonB.anchor.set(0.5);
      buttonR.input.useHandCursor = true;
      buttonB.input.useHandCursor = true;
    }
  },
  checkPlayer: function(playerIndex, color, card){
    this.playerArray[playerIndex].check(color, true);
    this.playerArray[playerIndex].alert(false);
  },
  showCard: function(card) {
    this.cardArray[this.nCards].flip(card);
    this.printWinColor(card);
    this.cardArray[this.nCards].move(true, 0,0);
    this.nCards++;
    this.cardArray.push(new cardGUI());
    if(this.nCards!=this.maxRounds){
      this.cardArray[this.nCards].make();
    }
    //game.time.events.add(Phaser.Timer.SECOND*time, this.cardArray[nCards].move, this);
    //this.cardArray[nCards].move();
    for(var i = 0; i<this.maxPlayers; i++){
      this.playerArray[i].check(0, false);
      this.playerArray[i].alert(false);
    }
    this.colorText.text = '';
    this.winnerText.text = '';
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
  updateWinners: function(winText, prize, balance, houseWon, poolAccept=false){
    if(!poolAccept){
      if(!houseWon){
        if(prize != 0){
          this.winnerText.text = winText +''+ prize;
        }
        else{
          this.winnerText.text = winText;
        }
      }
      else{
        this.winnerText.text = winText;
      }
    }
    for(var i = 0; i< balance.length ; i++)
      this.balanceText[0].text = balance[0];
  },
  updateRound: function(roundNumber){
    this.roundText.text = 'Round: '+ roundNumber;
  },
  foo: function(){
    this.foo = true;
  }
}