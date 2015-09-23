	var _;

	var bg;
	var panggung;
	var curtain, curtain2, curtainTop, curtainStraight;

	var grass1, grass2;	

var stateMain = function() {
	_ = this;

	function preload() {
		lgi("MAIN PRELOAD");
		_.load.image("bg-wood",			"assets/bg_wood.png");
		_.load.image("curtain",			"assets/curtain.png");
		_.load.image("curtain-straight","assets/curtain_straight.png");
		_.load.image("curtain-top",		"assets/curtain_top.png");

		_.load.image("grass1",			"assets/grass1.png");
		_.load.image("grass2",			"assets/grass2.png");

		_.load.image("cross-hair", 		"assets/crosshair_blue_large.png");

	}

	function create() {
		lgi("MAIN CREATE");

		bg = _.add.tileSprite(0,0, game.width, game.height, "bg-wood");

		panggung = _.add.group();

		curtainTop = _.add.tileSprite(0, 40, game.width, 63, "curtain-top");

		curtain = _.add.sprite(0,0,"curtain");
		curtain2 = _.add.sprite(0,0,"curtain");
		curtain2.scale.set(-1,1);
		curtain2.position.set(game.width, 0);

		curtainStraight = _.add.tileSprite(0, 0, game.width, 80, "curtain-straight");
		

		/* atur panggung */
		grass1 = new Phaser.TileSprite(_, -50, game.height, game.width + 100, 200, "grass1");
		grass1.anchor.set(0,1);
		grass2 = new Phaser.TileSprite(_, 0, game.height + 20, game.width + 100, 200, "grass2");
		grass2.anchor.set(0,1);

		panggung.add(grass1);
		panggung.add(grass2);

	}

	function createCrossHair() {
		
	}

	function update() {
		

	}

	function render() {
		
	}

	this.preload = preload;
	this.create = create;
	this.update = update;
	this.render = render;
}