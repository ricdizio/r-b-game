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

var playGame = {
  preload: function() {
    game.stage.disableVisibilityChange = true;
    game.load.image('table', 'assets/table2.png');
    game.load.image('circle', 'assets/circle.png');
    game.load.image('checkRojo', 'assets/checkRed.png');
    game.load.image('checkNegro', 'assets/checkBlack.png');
    game.load.image('ButtonR', 'assets/buttonR.png');
    game.load.image('ButtonB', 'assets/buttonB.png');
    game.load.image('alert', 'assets/turnAlert.png');
    game.load.spritesheet('cards0', 'assets/cards0.png', 334, 440);
    game.load.spritesheet('flip', 'assets/flip.png', 167, 243);
    
    for(var i = 0; i < 52; i++){
      game.load.image("card" + i, "assets/card" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
    }
  },
  create: function() {
    game.add.sprite(0,0,'table');
    spriteCard = this.makeCard();
    buttonR = game.add.sprite(game.width/2 - 100, game.height*0.9,'ButtonR');
    buttonB = game.add.sprite(game.width/2 + 100, game.height*0.9,'ButtonB');
    circle1Turn = game.add.sprite(game.width*0.2, game.height/2, 'circle');
    circle2Turn = game.add.sprite(game.width*0.8, game.height/2, 'circle');
    circle3Turn = game.add.sprite(game.width/2, game.height*0.15, 'circle');
    alert = game.add.sprite(game.width*0.2, game.height/2, 'alert');
    alert.scale.set(gameOptions.alertScale);
    alert.anchor.set(0.5);
    buttonR.anchor.set(0.5);
    buttonB.anchor.set(0.5);
    circle1Turn.anchor.set(0.5);
    circle2Turn.anchor.set(0.5);
    circle3Turn.anchor.set(0.5);
    buttonR.scale.set(gameOptions.buttonScale);
    buttonB.scale.set(gameOptions.buttonScale);
    circle1Turn.scale.set(gameOptions.circleScale);
    circle2Turn.scale.set(gameOptions.circleScale);
    circle3Turn.scale.set(gameOptions.circleScale);
    buttonR = game.add.button(game.width/2 - 100, game.height*0.9, 'buttonR', this.onClickR, this, 0, 0, 0);
    buttonB = game.add.button(game.width/2 + 100, game.height*0.9, 'buttonB', this.onClickB, this, 0, 0, 0);    
    buttonR.anchor.set(0.5);
    buttonB.anchor.set(0.5);
    spriteCard.isFlipping = false;
    nameText = game.add.text(game.width/2, 20,'', { fontSize: '32px', fill: '#000' });
    colorText = game.add.text(game.width/2, game.height/3,'', { fontSize: '32px', fill: '#000' });
    roundText = game.add.text(20, game.height-40,'Rund: 0', { fontSize: '32px', fill: '#000' });
    winnerText = game.add.text(game.width/2, 20,'', { fontSize: '32px', fill: '#000' });
    nameText.anchor.set(0.5);
    colorText.anchor.set(0.5);
    winnerText.anchor.set(0.5);
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
    //winnerText.text = '';
    nameText.text = playerText;
    if(alert)
      alert.destroy();
    if(playerIndex == 0){
      winnerText.text = '';
      alert = game.add.sprite(game.width*0.2, game.height/2, 'alert');
    }
    else if(playerIndex == 1){
      winnerText.text = '';
      alert = game.add.sprite(game.width/2, game.height*0.15, 'alert');
    }
    else if(playerIndex == 2){
      winnerText.text = '';
      alert = game.add.sprite(game.width*0.8, game.height/2, 'alert');
    }
    alert.scale.set(gameOptions.alertScale);
    alert.anchor.set(0.5);   
  },
  checkPlayer: function(playerIndex, color){
    if(playerIndex == 0){
      check0 = game.add.sprite(game.width*0.2, game.height/2, 'check'+color);
      check0.anchor.set(0.5);
      check0.scale.set(gameOptions.checkScale);
    }
    else if(playerIndex == 1){
      check1 = game.add.sprite(game.width/2, game.height*0.15, 'check'+color);
      check1.anchor.set(0.5);
      check1.scale.set(gameOptions.checkScale);
    }
    else if(playerIndex == 2){
      check2 = game.add.sprite(game.width*0.8, game.height/2, 'check'+color);
      check2.anchor.set(0.5);
      check2.scale.set(gameOptions.checkScale);
    }
  },
  flipCard: function(card) {
    flipTween = game.add.tween(spriteCard.scale).to({
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
    }
  },
  winColor: function(card) {
    nameText.text = '';
    if(card.color){
      colorText.text = '¡RED!';
    }
    else{
      colorText.text = '¡BLACK!';
    }
  },
  updateWinners: function(winText, prize, balance, houseWon){
    if(!houseWon){
      if(prize != 0){
        winnerText.text = winText + prize;
      }
      else{
        winnerText.text = winText;
      }
    }
    else{
      winnerText.text = winText;
    }
  },
  updateRound: function(roundNumber){
    roundText.text = 'Round: '+ roundNumber;
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
    check0.destroy();
    check1.destroy();
    check2.destroy();
    alert.destroy();
    colorText.text = '';
    winnerText.text = '';
    game.time.events.add(Phaser.Timer.SECOND*0.5, function(){
      spriteCard.destroy();
      spriteCard = this.makeCard();
    }, this) 
  },
  makeCard: function() {
    cardAux = game.add.sprite(game.width / 2, game.height*3/4, "flip", 0);
    cardAux.anchor.set(0.5);
    cardAux.scale.set(gameOptions.cardScaleOff);
    return cardAux;
  }
}
