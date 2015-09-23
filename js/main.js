var game = new Phaser.Game(800, 480, Phaser.AUTO, 'game');

game.state.add("menu", new stateMenu());
game.state.add("main", new stateMain());


game.state.start("main");