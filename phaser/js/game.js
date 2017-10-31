var game;

var gameOptions = {
    gameWidth: 1260,
    gameHeight: 600,
    cardSheetWidth: 65,
    cardSheetHeight: 81,
    cardScale: 0.8,
    buttonScale: 0.4,
    flipZoom: 1.2,
    flipSpeed: 500
}

//var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight,Phaser.AUTO, '', { preload: preload, create: create, update: update });
var button;
var turn;

function preload() {
    game.load.spritesheet('flip', 'data/flip.png', 167, 243);
    game.load.image('ButtonR', 'data/buttonR.png');
    game.load.image('ButtonB', 'data/buttonB.png');
    game.load.spritesheet('cards0', 'data/cards0.png', 334, 440);
    game.load.image('table', 'data/table2.png');
    for(var i = 0; i < 51; i++){
        game.load.image("card" + i, "data/card" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
    }
}

function create() {
    game.add.sprite(0,0,'table');
    var buttonR = game.add.sprite(50,game.height-200,'ButtonR');
    var buttonB = game.add.sprite(game.width-250,game.height-180,'ButtonB');
    var card = game.add.sprite(500, 50,'flip',0);
    card.scale.set(gameOptions.cardScale);
    buttonR.scale.set(gameOptions.buttonScale);
    buttonB.scale.set(gameOptions.buttonScale);

    card.isFlipping = false;
    game.input.onDown.add(function(){
        // if the card is not flipping...
        if(!card.isFlipping){

            // it's flipping now!
            card.isFlipping = true;

            // start the first of the two flipping animations
            flipTween.start();
        }
    });

    flipTween = game.add.tween(card.scale).to({
        x: 0,
        y: gameOptions.flipZoom
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

    flipTween.onComplete.add(function(){
        card.frame = 1 - card.frame;
        backFlipTween.start();
    });
    backFlipTween = game.add.tween(card.scale).to({
        x: 1,
        y: 1
    }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

    // once the card has been placed down on the table, we can flip it again
    backFlipTween.onComplete.add(function(){
        card.isFlipping = false;
    });
}

function update() {
    
}

function makeCard(cardIndex) {
    var card = game.add.sprite(gameOptions.cardSheetWidth * gameOptions.cardScale / -2, game.height / 2, "cards0");
    card.anchor.set(0.5);
    card.scale.set(gameOptions.cardScale);
    card.loadTexture("cards" + getCardTexture(deck[cardIndex]));
    card.frame = getCardFrame(deck[cardIndex]);
    return card;
}

function getCardTexture(cardValue){
    return Math.floor((cardValue % 13) / 3) + 5 * Math.floor(cardValue / 26);
}

function getCardFrame(cardValue){
    return (cardValue % 13) % 3 + 3 * (Math.floor(cardValue / 13) % 2);
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