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
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
}

var button;
var flip = false;
var cardNumber = 0;

function preload() {
    game.load.spritesheet('flip', 'assets/flip.png', 167, 243);
    game.load.image('ButtonR', 'assets/buttonR.png');
    game.load.image('ButtonB', 'assets/buttonB.png');
    game.load.spritesheet('cards0', 'assets/cards0.png', 334, 440);
    game.load.image('table', 'assets/table2.png');
    
    for(var i = 0; i < 51; i++){
        game.load.image("card" + i, "assets/card" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
    }
}
function create() {
    game.add.sprite(0,0,'table');
    var buttonR = game.add.sprite(50,game.height-200,'ButtonR');
    var buttonB = game.add.sprite(game.width-250,game.height-180,'ButtonB');
    card =  game.add.sprite(game.width / 2, 0, "flip", 0);
    card.anchor.set(0.5);
    card.scale.set(gameOptions.cardScale);
    buttonR.scale.set(gameOptions.buttonScale);
    buttonB.scale.set(gameOptions.buttonScale);
    //buttonR = game.add.button(50,game.height-200, 'buttonR', onClickR(), this, 0, 0, 0);
    buttonB = game.add.button(game.width-250,game.height-180, 'buttonB', onClickB, this, 0, 0, 0);    

    card.isFlipping = false;
}
function onClickR(){
    flip = !flip;
}
function onClickB(){
    flip = !flip;
}
function update(card) {
    if(flip){
        flipTween = game.add.tween(card.scale).to({
            x: 0,
            y: gameOptions.flipZoom
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

        flipTween.onComplete.add(function(){
            card.frame = 1 - card.frame;
            backFlipTween.start();
            flip = false;
        });
    
        backFlipTween = game.add.tween(card.scale).to({
            x: 1,
            y: 1
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
        
        backFlipTween.onComplete.add(function(){
            card.isFlipping = false;
        });

        if(!card.isFlipping){
            moveCards(card);
            card.isFlipping = true;
            // start the first of the two flipping animations
            flipTween.start();
        }
    }
}
function handleSwipe(card) {
    var tween = game.add.tween(card).to({
        x: game.width / 2
    }, SVGAngle.height/2, Phaser.Easing.Cubic.Out, true);
    tween.onComplete.add(function() {
        game.time.events.add(Phaser.Timer.SECOND, moveCards); 
    })
}
function moveCards(card) {
    var moveDownTween = game.add.tween(card).to({
        y: game.height / 2
    }, 500, Phaser.Easing.Cubic.Out, true);
    game.time.events.add(Phaser.Timer.SECOND*2, fadeCards(card));
}
function fadeCards(card){
    for(var i = 0; i < 2; i++){
        var fadeTween = game.add.tween(card).to({
            alpha: 0
        }, 500, Phaser.Easing.Linear.None, true);
    }
    game.time.events.add(Phaser.Timer.SECOND*2, function(){
        card =  game.add.sprite(game.width / 2, 0, "flip", 0);
        card.anchor.set(0.5);
        //game.state.start("PlayGame");    
    })  
}
function makeCard(cardIndex) {
    var card = game.add.sprite(gameOptions.cardSheetWidth * gameOptions.cardScale / -2, game.height / 2, "cards0");
    card.anchor.set(0.5);
    card.scale.set(gameOptions.cardScale);
    card.loadTexture("cards" + getCardTexture(deck[cardIndex]));
    card.frame = getCardFrame(deck[cardIndex]);
    return card;
}
