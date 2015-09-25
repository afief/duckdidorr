var tw;
var rifle;
var stateMain = function() {
	var _ = this;

	var score = 0;
	var duckPoin = 0;
	var targetPoin = 0;

	var ducks = ["duck_back", "duck_brown", "duck_outline_back", "duck_outline_brown", "duck_outline_target_brown", "duck_outline_target_white", "duck_outline_target_yellow", "duck_outline_white", "duck_outline_yellow", "duck_target_brown", "duck_target_white", "duck_target_yellow", "duck_white", "duck_yellow"];
	var targetBoards = ["target_back", "target_back_outline", "target_colored", "target_colored_outline", "target_red1", "target_red1_outline", "target_red2", "target_red2_outline", "target_red3", "target_red3_outline", "target_white", "target_white_outline"];
	var sticks = ["stick_metal", "stick_metal_outline", "stick_wood", "stick_wood_outline"];

	var panggung;
	var stall = {};
	var crossHair;

	var scoreHUD;

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

		/* create HUD */
		scoreHUD = _.add.group();
		scoreHUD.coinIcon = _.add.sprite(20,15, "coin_gold");
		scoreHUD.coinIcon.scale.set(0.6,0.6);
		scoreHUD.add(scoreHUD.coinIcon);

		scoreHUD.score = createNumberText("0", "_small");
		scoreHUD.score.position.set(scoreHUD.coinIcon.x + scoreHUD.coinIcon.width + 10, 20);
		scoreHUD.score.scale.set(0.8,0.8);
		scoreHUD.add(scoreHUD.score);

		scoreHUD.iconDuck = _.add.sprite(600, 20, "hud", "icon_duck");
		scoreHUD.add(scoreHUD.iconDuck);

		scoreHUD.duckPoin = createNumberText("0", "_small");
		scoreHUD.duckPoin.position.set(scoreHUD.iconDuck.x + scoreHUD.iconDuck.width + 10, 22);
		scoreHUD.duckPoin.scale.set(0.8,0.8);
		scoreHUD.add(scoreHUD.duckPoin);

		scoreHUD.iconTarget = _.add.sprite(700, 20, "hud", "icon_target");
		scoreHUD.add(scoreHUD.iconTarget);

		scoreHUD.targetPoin = createNumberText("0", "_small");
		scoreHUD.targetPoin.position.set(scoreHUD.iconTarget.x + scoreHUD.iconTarget.width + 10, 22);
		scoreHUD.targetPoin.scale.set(0.8,0.8);
		scoreHUD.add(scoreHUD.targetPoin);
	}

	function createTarget(_target, _stick) {
		var group		= _.add.group();
		var targetG		= _.add.group();
		group.target 	= targetG.create(0,0, "objects", _target); group.add(targetG);
		group.stick 	= group.create(0,0, "objects", _stick);

		group.target.anchor.set(0.5,1);
		group.stick.anchor.set(0.5,1); group.stick.y = group.stick.height;

		group.maxDamage = 1 + Math.floor(Math.random() * 5);
		group.damage = 0;
		group.target.inputEnabled = true;
		group.target.input.pixelPerfectClick = true;

		group.target.events.onInputDown.add(getShot);
		function getShot(currentTarget, pointer) {
			var shot = targetG.create(pointer.position.x - group.x, pointer.position.y - group.y, "objects", "shot_blue_small");
			shot.anchor.set(0.5,0.5);

			var center = {x: group.x, y: group.y - group.target.height / 2};
			var distanceScore = 10 - Math.floor(pointerDistance(center, game.input) / 10);
			distanceScore = (distanceScore < 0) ? 0 : distanceScore;

			showShotScore(group.x, group.y - targetG.height, distanceScore);
			score += distanceScore;
			scoreHUD.score.changeText(score.toString());

			group.damage += 1;
			if (group.damage >= group.maxDamage) {
				group.target.inputEnabled = false;
				_.add.tween(targetG).to({ y: game.height }, 800, Phaser.Easing.Cubic.In, true);
				_.add.tween(targetG.scale).to({ y: 0.4, x: 0.8 }, 500, Phaser.Easing.Cubic.InOut, true);

				if (ducks.indexOf(_target) >= 0) {
					duckPoin += 1;
					scoreHUD.duckPoin.changeText(duckPoin.toString());
				} else {
					targetPoin += 1;
					scoreHUD.targetPoin.changeText(targetPoin.toString());
				}
			}
		}

		return group;
	}

	function showShotScore(px, py, score) {
		var txt = createNumberText("+" + score.toString(), "_small");
		txt.x = px - txt.width/2;
		txt.y = py;

		_.add.tween(txt).to({ y: py-100, alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true).onComplete.add(showComplete);
		function showComplete() {
			txt.destroy();
		}
	}

	function createNumberText(str, endStr) {
		endStr = endStr || "";
		var group = _.add.group();

		insertText(str);
		function insertText(str) {
			var offsetX = 0;
			for (var i = 0; i < str.length; i++) {
				if (str[i] == " ") {
					offsetX += 10;
				} else {
					group.create(offsetX, 0, "hud", getFrameName(str[i], endStr));
					offsetX += group.getChildAt(group.children.length-1).width;
				}
			}
		}
		function getFrameName(char, end) {
			if (char == "+")
				return "text_plus" + end;
			else if (char == "x")
				return "text_cross" + end;
			else if (char == ":")
				return "text_dots" + end;
			else
				return "text_" + char + end;
		}

		group.changeText = function(txt) {
			group.removeAll();
			insertText(txt);
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
			target.x 		= 100 + (Math.random() * (game.width - 200));
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

		game.input.onDown.add(onDown);

		function onPause() {
			lgi("PAUSE");
		}
		function onResume() {
			lgi("RESUME");	
		}
		function onFocus() {
			lgi("FOCUS");
		}

		function onDown() {
			/* scale crossHair */
			if (crossHair.tweenDown) {
				crossHair.tweenDown.start();

				if (!rifle.isShot)
					_.add.tween(rifle).to({rotation: rifle.rotation + 0.1}, 400, Phaser.Easing.Cubic.Out, true).onComplete.add(shotComplete);
			} else {
				crossHair.tweenDown			= _.add.tween(crossHair.scale).to({x: 1.5, y: 1.5}, 200, Phaser.Easing.Cubic.Out, true);
				crossHair.tweenDownFinish	= _.add.tween(crossHair.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.In, false);
				crossHair.tweenDown.onComplete.add(scaleComplete);
				crossHair.tweenDownFinish;

				_.add.tween(rifle).to({rotation: rifle.rotation + 0.1}, 400, Phaser.Easing.Cubic.Out, true).onComplete.add(shotComplete);
			}

			rifle.isShot = true;

			function scaleComplete() {
				crossHair.tweenDownFinish.start();
			}
			function shotComplete() {
				rifle.isShot = false;
			}
		}
	}

	this.preload = function() {
		lgi("MAIN PRELOAD");
		_.load.atlasXML('stall', 'assets/spritesheet_stall.png', 'assets/spritesheet_stall.xml');
		_.load.atlasXML('objects', 'assets/spritesheet_objects.png', 'assets/spritesheet_objects.xml');
		_.load.atlasXML('hud', 'assets/spritesheet_hud.png', 'assets/spritesheet_hud.xml');

		_.load.image("stand", "assets/stand.png");
		_.load.image("coin_gold", "assets/coin_gold.png");
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
		if (!rifle.isShot)
			rifle.rotation = 0.2 - game.input.y / (game.height - 115) * 0.4;
	}
	this.render = function() {

	}
}