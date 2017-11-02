var game;

var gameOptions = {
    gameWidth: 1260,
    gameHeight: 600,
    cardSheetWidth: 65,
    cardSheetHeight: 81,
    cardScaleOff: 0.5,
    cardScaleOn: 1,
    circleScale: 0.4,
    alertScale: 0.5,
    checkScale: 0.75,
    buttonScale: 0.1,
    flipZoom: 1.2,
    flipSpeed: 300
}
window.onload = function() {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}

var button;
var flip = false;
var cardNumber = 0;
var playCard = false;
var betNumber = -1;
var check0, check1, check2, alert;
var cardsInGame = new Array();
var turn = 0, lastTurn = -1;
var nameTurn = ['¡Tu Turno!', 'Jugador 1', 'Jugador 2'];

var playGame = function(game){}
playGame.prototype = {
    preload: function() {
        game.load.image('table', 'assets/table2.png');
        game.load.image('circle', 'assets/circle.png');
        game.load.image('check', 'assets/check.png');
        game.load.image('ButtonR', 'assets/buttonR.png');
        game.load.image('ButtonB', 'assets/buttonB.png');
        game.load.image('alert', 'assets/turnAlert.png');
        game.load.spritesheet('cards0', 'assets/cards0.png', 334, 440);
        game.load.spritesheet('flip', 'assets/flip.png', 167, 243);
        
        for(var i = 0; i < 51; i++){
            game.load.image("card" + i, "assets/card" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
        }
    },
    create: function() {
        game.add.sprite(0,0,'table');
        card = this.makeCard();
        var buttonR = game.add.sprite(game.width/2 - 100, game.height*0.9,'ButtonR');
        var buttonB = game.add.sprite(game.width/2 + 100, game.height*0.9,'ButtonB');
        var buttonE = game.add.sprite(0,0,'event');
        var circle1Turn = game.add.sprite(game.width*0.2, game.height/2, 'circle');
        var circle2Turn = game.add.sprite(game.width*0.8, game.height/2, 'circle');
        var circle3Turn = game.add.sprite(game.width/2, game.height*0.15, 'circle');
        alert = game.add.sprite(game.width*0.2, game.height/2, 'alert');
        alert.scale.set(gameOptions.alertScale);
        alert.anchor.set(0.5);

        buttonR.anchor.set(0.5);
        buttonB.anchor.set(0.5);
        buttonE.anchor.set(0.5);
        circle1Turn.anchor.set(0.5);
        circle2Turn.anchor.set(0.5);
        circle3Turn.anchor.set(0.5);

        buttonR.scale.set(gameOptions.buttonScale);
        buttonB.scale.set(gameOptions.buttonScale);
        circle1Turn.scale.set(gameOptions.circleScale);
        circle2Turn.scale.set(gameOptions.circleScale);
        circle3Turn.scale.set(gameOptions.circleScale);

        buttonE = game.add.button(0,0,'event', this.onClickEvent, this, 0, 0, 0);
        buttonR = game.add.button(game.width/2 - 100, game.height*0.9, 'buttonR', this.onClickR, this, 0, 0, 0);
        buttonB = game.add.button(game.width/2 + 100, game.height*0.9, 'buttonB', this.onClickB, this, 0, 0, 0);    

        buttonR.anchor.set(0.5);
        buttonB.anchor.set(0.5);
        card.isFlipping = false;

        nameText = game.add.text(game.width/2, 20, nameTurn[turn], { fontSize: '32px', fill: '#000' });
        betText = game.add.text(20, game.height-40,'Ronda:' + betNumber, { fontSize: '32px', fill: '#000' });
        var otherText = game.add.text(45, 10,'<- Turno otros Jugadores', { fontSize: '32px', fill: '#000' });
        nameText.anchor.set(0.5);

    },
    onClickR: function(){
        console.log("RED BUTTON");
        if(turn == 0){
            this.checkPlayer();
            console.log("BLACK BUTTON");
        }
    },
    onClickB: function(){
        if(turn == 0){
            this.checkPlayer();
            console.log("BLACK BUTTON");
        }
    },
    onClickEvent: function(){
        console.log("EVENT");
        if(turn!=0){
            this.checkPlayer();
        }
    },
    alertTurn: function(){
        nameText.text = nameTurn[turn]
        alert.destroy();
        if(turn == 0){
            alert = game.add.sprite(game.width*0.2, game.height/2, 'alert');
        }
        else if(turn == 1){
            alert = game.add.sprite(game.width/2, game.height*0.15, 'alert');
        }
        else if(turn == 2){
            alert = game.add.sprite(game.width*0.8, game.height/2, 'alert');
        }
        alert.scale.set(gameOptions.alertScale);
        alert.anchor.set(0.5);
    },
    checkPlayer: function(){

        if(turn == 0){
            check0 = game.add.sprite(game.width*0.2, game.height/2, 'check');
            check0.anchor.set(0.5);
            check0.scale.set(gameOptions.checkScale);
        }
        else if(turn == 1){
            check1 = game.add.sprite(game.width/2, game.height*0.15, 'check');
            check1.anchor.set(0.5);
            check1.scale.set(gameOptions.checkScale);
        }
        else if(turn == 2){
            check2 = game.add.sprite(game.width*0.8, game.height/2, 'check');
            check2.anchor.set(0.5);
            check2.scale.set(gameOptions.checkScale);
        }
        if(!playCard && turn==2){
            playCard = true;
            turn = 0;

            this.flipCard();
        }else{
            turn++;
            this.alertTurn();
        }
    },
    flipCard: function() {
        this.card = card;
        this.flipTween = game.add.tween(this.card.scale).to({
            x: 0,
            y: gameOptions.flipZoom
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

        this.flipTween.onComplete.add(function(){
            this.card.frame = 1 - this.card.frame;
            this.backFlipTween.start();
            //flip = false;
        }, this);
    
        this.backFlipTween = game.add.tween(this.card.scale).to({
            x: 1,
            y: 1
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
        
        this.backFlipTween.onComplete.add(function(){
            this.card.isFlipping = false;
        }, this);

        if(!this.card.isFlipping){
            this.moveCards();
            this.card.isFlipping = true;
            // start the first of the two flipping animations
            this.flipTween.start();
        }
    },
    handleSwipe: function() {
        var tween = game.add.tween(this.card).to({
            x: game.width / 2
        }, SVGAngle.height/2, Phaser.Easing.Cubic.Out, true);
        tween.onComplete.add(function() {
        game.time.events.add(Phaser.Timer.SECOND, this.moveCards, this); 
        }, this)
    },
    moveCards: function() {
        var moveDownTween = game.add.tween(this.card).to({
            y: game.height / 2
        }, 500, Phaser.Easing.Cubic.Out, true);
        game.time.events.add(Phaser.Timer.SECOND*2, this.fadeCards, this);
    },
    fadeCards: function(){
        for(var i = 0; i < 2; i++){
            var fadeTween = game.add.tween(this.card).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true);
        }
        check0.destroy();
        check1.destroy();
        check2.destroy();
        this.alertTurn();
        game.time.events.add(Phaser.Timer.SECOND*0.5, function(){
            playCard = false;
            card.destroy();
            card = this.makeCard();
            betText.text = 'Ronda: ' + betNumber; 
            //card =  game.add.sprite(game.width / 2, 0, "flip", 0);
            //card.anchor.set(0.5);
            //game.state.start("PlayGame");    
        }, this)  
    },
    makeCard: function() {
        if(betNumber == 9)
            betNumber = 0;
        else
            betNumber++;
        cardsInGame.push(game.add.sprite(game.width / 2, game.height*3/4, "flip", 0));
        //card =  game.add.sprite(game.width / 2, game.height*3/4, "flip", 0);
        cardsInGame[betNumber].anchor.set(0.5);
        cardsInGame[betNumber].scale.set(gameOptions.cardScaleOff);
        return cardsInGame[betNumber];
        /*
        var card = game.add.sprite(gameOptions.cardSheetWidth * gameOptions.cardScaleOff / -2, game.height / 2, "cards0");
        card.anchor.set(0.5);
        card.scale.set(gameOptions.cardScaleOff);
        card.loadTexture("cards" + getCardTexture(deck[cardIndex]));
        card.frame = getCardFrame(deck[cardIndex]);
        return card;*/
    }
}