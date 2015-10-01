var game = new Phaser.Game(800, 480, Phaser.AUTO, 'game');

game.state.add("boot", new stateBoot());
game.state.add("main", new stateMain());


game.state.start("boot");

document.getElementById("game").onwheel = preventDefault;
document.getElementById("game").onmousewheel = preventDefault;