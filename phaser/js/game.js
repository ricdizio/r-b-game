var game;

var gameOptions = {
    gameWidth: 1260,
    gameHeight: 600,
    cardSheetWidth: 65,
    cardSheetHeight: 81,
    cardScale: 1,
    buttonScale: 0.4,
    flipZoom: 1.2,
    flipSpeed: 300
}
window.onload = function() {
    //game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight,Phaser.AUTO, '', { preload: preload, create: create, update: update });
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}

var button;
var flip = false;
var cardNumber = 0;
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
        var buttonR = game.add.sprite(50,game.height-200,'ButtonR');
        var buttonB = game.add.sprite(game.width-250,game.height-180,'ButtonB');
        card =  game.add.sprite(game.width / 2, 0, "flip", 0);
        card.anchor.set(0.5);
        card.scale.set(gameOptions.cardScale);
        buttonR.scale.set(gameOptions.buttonScale);
        buttonB.scale.set(gameOptions.buttonScale);
        buttonR = game.add.button(50,game.height-200, 'buttonR', this.onClickR, this, 0, 0, 0);
        buttonB = game.add.button(game.width-250,game.height-180, 'buttonB', this.onClickB, this, 0, 0, 0);
        

        card.isFlipping = false;
    },

    onClickB: function(){
        flip = !flip;
    },
    onClickB: function(){
        flip = !flip;
    },

    update: function() {
        this.card = card;
        if(flip){
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
            card =  game.add.sprite(game.width / 2, 0, "flip", 0);
            card.anchor.set(0.5);
            //game.state.start("PlayGame");    
        }, this)  
    },

    makeCard: function(cardIndex) {
        var card = game.add.sprite(gameOptions.cardSheetWidth * gameOptions.cardScale / -2, game.height / 2, "cards0");
        card.anchor.set(0.5);
        card.scale.set(gameOptions.cardScale);
        card.loadTexture("cards" + getCardTexture(deck[cardIndex]));
        card.frame = getCardFrame(deck[cardIndex]);
        return card;
    },
/*
    getCardTexture: function(cardValue){
        return Math.floor((cardValue % 13) / 3) + 5 * Math.floor(cardValue / 26);
    },

    getCardFrame: function(cardValue){
        return (cardValue % 13) % 3 + 3 * (Math.floor(cardValue / 13) % 2);
    }*/
}
/*
function moveCards() {
    var cardToMove = this.nextCardIndex % 2;
    var moveOutTween = game.add.tween(this.cardsInGame[cardToMove]).to({
        x: game.width + gameOptions.cardSheetWidth * gameOptions.cardScale
    }, 500, Phaser.Easing.Cubic.Out, true);
    cardToMove = (this.nextCardIndex + 1) % 2
    var moveDownTween = game.add.tween(this.cardsInGame[cardToMove]).to({
        y: game.height / 2
    }, 500, Phaser.Easing.Cubic.Out, true);
    moveDownTween.onComplete.add(function() {
        var cardToMove = this.nextCardIndex % 2
        this.cardsInGame[cardToMove].loadTexture("cards" + this.getCardTexture(this.deck[this.nextCardIndex]));
        this.cardsInGame[cardToMove].frame = this.getCardFrame(this.deck[this.nextCardIndex]);
        this.nextCardIndex = (this.nextCardIndex + 1) % 52;
        this.cardsInGame[cardToMove].x = gameOptions.cardSheetWidth * gameOptions.cardScale / -2;
        game.input.onDown.add(this.beginSwipe, this);
        this.infoGroup.visible = true;
    }, this)
}*/