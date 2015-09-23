var tw;
var stateMain = function() {
	var _ = this;

	var ducks = ["duck_back", "duck_brown", "duck_outline_back", "duck_outline_brown", "duck_outline_target_brown", "duck_outline_target_white", "duck_outline_target_yellow", "duck_outline_white", "duck_outline_yellow", "duck_target_brown", "duck_target_white", "duck_target_yellow", "duck_white", "duck_yellow"];
	var sticks = ["stick_metal", "stick_metal_outline", "stick_wood", "stick_woodFixed", "stick_woodFixed_outline", "stick_wood_outline"];

	var panggung;
	var stall = {};

	function createGround() {
		/*background*/
		stall.bg = _.add.tileSprite(0,0, game.width, game.height, "stall", "bg_wood");

		panggung = _.add.group();

		/* tirai atas dan samping */
		stall.curtainTop = _.add.tileSprite(0, 40, game.width, 63, "stall", "curtain_top");

		stall.curtain = _.add.sprite(0, 0, "stall", "curtain");
		stall.curtain2 = _.add.sprite(0, 0, "stall", "curtain");
		stall.curtain2.scale.set(-1,1);
		stall.curtain2.position.set(game.width, 0);

		stall.curtainStraight = _.add.tileSprite(0, 0, game.width, 80, "stall", "curtain_straight");
		
		/* atur panggung */
		stall.grass1 = new Phaser.TileSprite(_, -150, game.height, game.width + 150, 200, "stall", "grass1");
		stall.grass1.anchor.set(0,1);
		stall.grass2 = new Phaser.TileSprite(_, -100, game.height + 20, game.width + 100, 200, "stall", "grass2");
		stall.grass2.anchor.set(0,1);

		panggung.add(stall.grass1);
		panggung.add(stall.grass2);

		_.add.tween(stall.grass1).to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
		_.add.tween(stall.grass2).to({ x: 0 }, 2500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
	}

	function createTarget(_target, _stick) {
		var group		= _.add.group();
		group.target 	= group.create(0,0, "objects", _target);
		group.stick 	= group.create(0,0, "objects", _stick);

		group.target.anchor.set(0.5,1);
		group.stick.anchor.set(0.5,0);

		group.damage = 0;
		group.target.inputEnabled = true;
		group.target.input.pixelPerfectClick = true;

		group.target.events.onInputDown.add(getShot);
		function getShot(currentTarget, pointer) {
			var shot = group.create(pointer.position.x - group.x, pointer.position.y - group.y, "objects", "shot_blue_small");
			shot.anchor.set(0.5,0.5);
		}

		return group;
	}

	function manageTargets() {
		insertTargetDuck();
		insertTargetDuck();
		insertTargetDuck();
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
			panggung.addAt(target, 1);

			var tw1 = _.add.tween(target).to({ x: game.width + 100 }, speed, Phaser.Easing.Linear.None, true).onComplete.add(onTargetFinished);
			var tw2 = _.add.tween(target).to({ y: yJump }, speedUpDown, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
			function onTargetFinished() {
				lgi("Finished", target.damage);
				tw2.stop();
				tw1 = undefined;
				tw2 = undefined;
				////target.destroy();
			}
		}
	}

	this.preload = function() {
		lgi("MAIN PRELOAD");
		_.load.atlasXML('stall', 'assets/spritesheet_stall.png', 'assets/spritesheet_stall.xml');
		_.load.atlasXML('objects', 'assets/spritesheet_objects.png', 'assets/spritesheet_objects.xml');
	}
	this.create = function() {
		lgi("MAIN CREATE");
		createGround();
		manageTargets();
	}
	this.update = function() {
	}
	this.render = function() {
		
	}
}