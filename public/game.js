var game
var gameOpt = {
  gameWidth: 1133,
  gameHeight: 853,
}

window.onload = function() {
  game = new Phaser.Game(gameOpt.gameWidth, gameOpt.gameHeight)
  game.state.add("playGame", playGame)
  game.state.add("waitRoom", waitRoom)
  game.state.start("waitRoom")
}

