var tw;
var rifle;
var stateMain = function() {
	var _ = this;

	var ducks = ["duck_back", "duck_brown", "duck_outline_back", "duck_outline_brown", "duck_outline_target_brown", "duck_outline_target_white", "duck_outline_target_yellow", "duck_outline_white", "duck_outline_yellow", "duck_target_brown", "duck_target_white", "duck_target_yellow", "duck_white", "duck_yellow"];
	var targetBoards = ["target_back", "target_back_outline", "target_colored", "target_colored_outline", "target_red1", "target_red1_outline", "target_red2", "target_red2_outline", "target_red3", "target_red3_outline", "target_white", "target_white_outline"];
	var sticks = ["stick_metal", "stick_metal_outline", "stick_wood", "stick_wood_outline"];

	var panggung;
	var stall = {};
	var crossHair;
	

	function createGround() {
		/*background*/
		stall.bg = _.add.tileSprite(0,0, game.width, game.height, "stall", "bg_wood");

		panggung = _.add.group();

		/* atur bagian dashboard */
		stall.dashboard = _.add.sprite(0, game.height - 115, "stand");

		/* tirai atas dan samping */
		stall.curtainTop = _.add.tileSprite(0, 40, game.width, 63, "stall", "curtain_top");

		stall.curtain = _.add.sprite(0, 0, "stall", "curtain");
		stall.curtain2 = _.add.sprite(0, 0, "stall", "curtain");
		stall.curtain2.scale.set(-1,1);
		stall.curtain2.position.set(game.width, 0);

		stall.curtainStraight = _.add.tileSprite(0, 0, game.width, 80, "stall", "curtain_straight");
		
		/* atur panggung */
		panggung.grass1 = new Phaser.TileSprite(_, -150, game.height, game.width + 150, 200, "stall", "grass1");
		panggung.grass1.anchor.set(0,1);
		panggung.grass2 = new Phaser.TileSprite(_, -100, game.height + 20, game.width + 100, 200, "stall", "grass2");
		panggung.grass2.anchor.set(0,1);

		panggung.add(panggung.grass1);
		panggung.add(panggung.grass2);

		_.add.tween(panggung.grass1).to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
		_.add.tween(panggung.grass2).to({ x: 0 }, 2500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

		/* create crosshair */
		crossHair = _.add.sprite(0,0, "hud", "crosshair_blue_large");
		crossHair.anchor.set(0.5,0.5);

		/* create rifle */
		rifle = _.add.sprite(game.width, game.height + 150, "objects", "rifle");
		rifle.anchor.set(1,1);
	}

	function createTarget(_target, _stick) {
		var group		= _.add.group();
		var targetG		= _.add.group();
		group.target 	= targetG.create(0,0, "objects", _target); group.add(targetG);
		group.stick 	= group.create(0,0, "objects", _stick);

		group.target.anchor.set(0.5,1);
		group.stick.anchor.set(0.5,1); group.stick.y = group.stick.height;

		tw = group.target;

		group.maxDamage = 20;
		group.damage = 0;
		group.target.inputEnabled = true;
		group.target.input.pixelPerfectClick = true;

		group.target.events.onInputDown.add(getShot);
		function getShot(currentTarget, pointer) {
			var shot = targetG.create(pointer.position.x - group.x, pointer.position.y - group.y, "objects", "shot_blue_small");
			shot.anchor.set(0.5,0.5);

			group.damage += 10;
			if (group.damage >= group.maxDamage) {
				group.target.inputEnabled = false;
				_.add.tween(targetG).to({ y: game.height }, 800, Phaser.Easing.Cubic.In, true);
				_.add.tween(targetG.scale).to({ y: 0.1, x: 0.8 }, 500, Phaser.Easing.Cubic.In, true);
			}
		}

		return group;
	}

	function manageTargets() {

		var timer = _.time.events.add(Phaser.Timer.SECOND * 4, repeatInsert, this);
		timer.loop = true;
		function repeatInsert() {
			var rand = Math.floor(Math.random() * 2);
			if (rand == 0)
				insertTargetDuck();
			else
				insertTargetBoard();

			if (timer.delay > 1000)
			timer.delay -= 50;
		}
		
		function insertTargetDuck() {
			var randomDuck = ducks[Math.floor(Math.random() * ducks.length)];
			var randomSticks = sticks[Math.floor(Math.random() * sticks.length)];

			var target 		= createTarget( randomDuck, randomSticks );
			var yAxis		= 210 + (Math.random() * 90);
			var yJump		= yAxis + 50 + (Math.random() * 50);
			var speed 		= 5000 + (Math.random() * 5000);
			var speedUpDown	= 1000 + (Math.random() * 3000);			

			target.x = -100;
			target.y = yAxis;
			panggung.addAt(target, randomPanggungIndex());

			var tw1 = _.add.tween(target).to({ x: game.width + 100 }, speed, Phaser.Easing.Linear.None, true).onComplete.add(onTargetFinished);
			var tw2 = _.add.tween(target).to({ y: yJump }, speedUpDown, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
			function onTargetFinished() {
				lgi("Finished");
				tw2.stop();
				tw1 = undefined;
				tw2 = undefined;
				target.destroy();
			}
		}
		function insertTargetBoard() {
			var boardsDucks = ducks.concat(targetBoards);
			var randomTarget = boardsDucks[Math.floor(Math.random() * boardsDucks.length)];
			var randomSticks = sticks[Math.floor(Math.random() * sticks.length)];

			var target 		= createTarget( randomTarget, randomSticks );
			target.x 		= Math.random() * game.width;
			target.y 		= game.height + 150;

			var yAxis		= 260 + (Math.random() * 40);

			panggung.addAt(target, randomPanggungIndex());

			_.add.tween(target).to({ y: yAxis}, 400, Phaser.Easing.Quadratic.Out, true).onComplete.add(onFinishUp);
			function onFinishUp() {
				_.time.events.add(Phaser.Timer.SECOND + (Math.random() * 3000), onIdle, this);
			}
			function onIdle() {
				_.add.tween(target).to({ y: game.height + 150}, 400, Phaser.Easing.Quadratic.In, true).onComplete.add(onFinishIdle);
				_.time.events.remove(onIdle);
			}
			function onFinishIdle() {
				target.destroy();
			}

		}
		function randomPanggungIndex() {	
			var r = Math.floor(Math.random() * 3);
			if (r == 0)
				return 0;
			else if (r == 1)
				return panggung.getChildIndex(panggung.grass2) + 1;
			else
				return panggung.getChildIndex(panggung.grass1) + 1;
		}
	}

	function manageEvents() {
		game.onPause.add(onPause);
		game.onResume.add(onResume);
		game.onFocus.add(onFocus);

		function onPause() {
			lgi("PAUSE");
		}
		function onResume() {
			lgi("RESUME");	
		}
		function onFocus() {
			lgi("FOCUS");
		}
	}

	this.preload = function() {
		lgi("MAIN PRELOAD");
		_.load.atlasXML('stall', 'assets/spritesheet_stall.png', 'assets/spritesheet_stall.xml');
		_.load.atlasXML('objects', 'assets/spritesheet_objects.png', 'assets/spritesheet_objects.xml');
		_.load.atlasXML('hud', 'assets/spritesheet_hud.png', 'assets/spritesheet_hud.xml');

		_.load.image("stand", "assets/stand.png");
	}
	this.create = function() {
		lgi("MAIN CREATE");
		createGround();
		manageTargets();
		manageEvents();
	}
	this.update = function() {
		crossHair.position.set(game.input.x, game.input.y);
		rifle.x = game.input.x + 220;
		rifle.rotation = 0.2 - game.input.y / (game.height - 115) * 0.4;
	}
	this.render = function() {

	}
}