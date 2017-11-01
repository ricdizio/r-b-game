var game;

var gameOptions = {
    gameWidth: 1260,
    gameHeight: 600,
    cardSheetWidth: 65,
    cardSheetHeight: 81,
    cardScaleOff: 0.5,
    cardScaleOn: 1,
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
var cardsInGame = new Array();
var playGame = function(game){}
playGame.prototype = {
    preload: function() {
        game.load.spritesheet('flip', 'assets/flip.png', 167, 243);
        game.load.image('ButtonR', 'assets/buttonR.png');
        game.load.image('ButtonB', 'assets/buttonB.png');
        game.load.spritesheet('cards0', 'assets/cards0.png', 334, 440);
        game.load.image('table', 'assets/table2.png');

        
        for(var i = 0; i < 51; i++){
            game.load.image("card" + i, "assets/card" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
        }
    },
    create: function() {
        game.add.sprite(0,0,'table');
        card = this.makeCard();
        var buttonR = game.add.sprite(game.width/2 - 100, game.height*3/4 + 60,'ButtonR');
        var buttonB = game.add.sprite(game.width/2 + 100, game.height*3/4 + 60,'ButtonB');
        var buttonE = game.add.sprite(0,0,'event');
        buttonR.anchor.set(0.5);
        buttonB.anchor.set(0.5);
        buttonE.anchor.set(0.5);

        buttonR.scale.set(gameOptions.buttonScale);
        buttonB.scale.set(gameOptions.buttonScale);
        buttonE = game.add.button(0,0,'event', this.onClickEvent, this, 0, 0, 0);
        buttonR = game.add.button(game.width/2 - 115, game.height*3/4 + 45, 'buttonR', this.onClickR, this, 0, 0, 0);
        buttonB = game.add.button(game.width/2 + 85, game.height*3/4 + 45, 'buttonB', this.onClickB, this, 0, 0, 0);    

        card.isFlipping = false;
    },
    onClickR: function(){
        console.log("RED BUTTON");
    },
    onClickB: function(){
        if(!playCard){
            flip = !flip;
            playCard = true;
        }
        console.log("BLACK BUTTON");
    },
    onClickEvent: function(){
        console.log("EVENT");
    },
    update: function() {
        this.card = card;
        if(flip && playCard){
            this.flipTween = game.add.tween(this.card.scale).to({
                x: 0,
                y: gameOptions.flipZoom
            }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

            this.flipTween.onComplete.add(function(){
                this.card.frame = 1 - this.card.frame;
                this.backFlipTween.start();
                flip = false;
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
        game.time.events.add(Phaser.Timer.SECOND*2, function(){
            playCard = false;
            card.destroy();
            card = this.makeCard();
            //card =  game.add.sprite(game.width / 2, 0, "flip", 0);
            //card.anchor.set(0.5);
            //game.state.start("PlayGame");    
        }, this)  
    },
    makeCard: function() {
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