(function() {var lg 		= console.log.bind(console);
var lgi 	= console.info.bind(console);
var lgw 	= console.warn.bind(console);
var lge 	= console.error.bind(console);

function pointerDistance(p1, p2) {
	function sqr(n) {
		return n * n;
	}
	var res = Math.sqrt(sqr(p2.x - p1.x) + sqr(p2.y - p1.y));
	//lgi(p1.x, p1.y, p2.x, p2.y, res);
	return res;
}

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	e.returnValue = false;  
};"use strict";

var tw;
var stateMain = function() {
	var _ = this;

	var score = 0;
	var duckPoin = 0;
	var targetPoin = 0;
	var reloadScrollCount = 3;
	var totalBullets = 100;
	var isGameOver = true;
	var startShowSpeed = Phaser.Timer.SECOND * 3;

	var ducks = ["duck_brown", "duck_outline_brown", "duck_outline_target_brown", "duck_outline_target_white", "duck_outline_target_yellow", "duck_outline_white", "duck_outline_yellow", "duck_target_brown", "duck_target_white", "duck_target_yellow", "duck_white", "duck_yellow"]; //"duck_outline_back" "duck_back", 
	var targetBoards = ["target_colored", "target_colored_outline", "target_red1", "target_red1_outline", "target_red2", "target_red2_outline", "target_red3", "target_red3_outline", "target_white", "target_white_outline"]; //"target_back", "target_back_outline", 
	var sticks = ["stick_metal", "stick_metal_outline", "stick_wood", "stick_wood_outline"];

	var panggung;
	var stall = {};
	var crossHair;

	var scoreHUD;
	var rifle;
	var bullets;
	var timer;
	
	var sounds = {};
	var themes = [{bg: "bg_wood", b1: "grass1", b2: "grass2", crosshair: "crosshair_blue_large"}, {bg: "bg_blue", b1: "water1", b2: "water2", crosshair: "crosshair_red_large"}];
	var themeIndex = Math.floor(Math.random() * themes.length);
	var theme = themes[themeIndex];

	function reset() {
		score = 0;
		totalBullets = 100;
		duckPoin = 0;
		targetPoin = 0;
		startShowSpeed = Phaser.Timer.SECOND * 3;
		isGameOver = false;

		if (timer) {
			timer.delay = startShowSpeed;
			timer.timer.resume();
		}

		if (bullets) {
			bullets.reload(); // full bullets
			bullets.reload();
			bullets.reload();
			bullets.reload();
			bullets.reload();
		}
		if (scoreHUD) {
			scoreHUD.score.changeText("0");
			scoreHUD.duckPoin.changeText("0");
			scoreHUD.targetPoin.changeText("0");
		}

		if (stall.bggroup) {
			var i = stall.bggroup.length-1;
			while (i > 0) {
				stall.bggroup.getChildAt(i).destroy();
				i--;
			}

			//ganti tema
			themeIndex += 1;
			if (themeIndex >= themes.length) themeIndex = 0;
			theme = themes[themeIndex];
			lgi(theme);

			stall.bg.frameName = theme.bg;
			panggung.grass1.frameName = theme.b1;
			panggung.grass2.frameName = theme.b2;
		}
	}

	function createGround() {
		/* background */
		stall.bg = _.add.tileSprite(0,0, game.width, game.height, "stall", theme.bg);
		stall.bggroup = _.add.group();
		stall.bggroup.add(stall.bg);

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
		panggung.grass1 = new Phaser.TileSprite(_, -150, game.height, game.width + 150, 200, "stall", theme.b1);
		panggung.grass1.anchor.set(0,1);
		panggung.grass2 = new Phaser.TileSprite(_, -100, game.height + 20, game.width + 100, 200, "stall", theme.b2);
		panggung.grass2.anchor.set(0,1);

		panggung.add(panggung.grass1);
		panggung.add(panggung.grass2);

		_.add.tween(panggung.grass1).to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
		_.add.tween(panggung.grass2).to({ x: 0 }, 2500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

		/* create crosshair */
		crossHair = _.add.sprite(0,0, "hud", theme.crosshair);
		crossHair.anchor.set(0.5,0.5);

		/* create rifle */
		rifle = _.add.sprite(game.width, game.height + 150, "objects", "rifle");
		rifle.anchor.set(1,1);

		/* create HUD */
		scoreHUD = _.add.group();

		scoreHUD.coinIcon = _.add.sprite(70,15, "coin_gold");
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

		/* fullscreen icon */
		var fullscreenIcon = _.add.image(10, 10, "fullscreen-icon");
		fullscreenIcon.scale.set(0.9,0.9);

		fullscreenIcon.inputEnabled = true;
		fullscreenIcon.events.onInputDown.add(function() {
			if (game.scale.isFullScreen) {
				game.scale.stopFullScreen();
			}
			else {
				game.scale.startFullScreen(false);
			}
		}, this);
	}

	function createTarget(_target, _stick) {
		var group		= _.add.group();
		var targetG		= _.add.group();
		group.target 	= targetG.create(0,0, "objects", _target); group.add(targetG);
		group.stick 	= group.create(0,0, "objects", _stick);

		group.target.anchor.set(0.5,1);
		group.stick.anchor.set(0.5,1); group.stick.y = group.stick.height;

		group.maxDamage = 3;//2 + Math.floor(Math.random() * 4); // how many shot to do to make this target fall
		group.damage = 0;
		group.target.inputEnabled = true;
		group.target.input.pixelPerfectClick = true;

		group.target.events.onInputDown.add(getShot);
		function getShot(currentTarget, pointer) {
			if (bullets.shot()) {
				/* bekas tembakan */
				var shot = targetG.create(pointer.position.x - group.x, pointer.position.y - group.y, "objects", "shot_blue_small");
				shot.anchor.set(0.5,0.5);

				/* calculate score based on distance of shot */
				var center = {x: group.x, y: group.y - group.target.height / 2}; if (ducks.indexOf(_target) >= 0) center.y += group.target.height / 4;
				var distanceScore = 10 - Math.floor(pointerDistance(center, game.input) / 5);
				distanceScore = (distanceScore < 0) ? 0 : distanceScore;

				/* show shot score */
				showShotScore(group.x, group.y - targetG.height, distanceScore);
				score += distanceScore;
				scoreHUD.score.changeText(score.toString());

				group.damage += 1;
				sounds.shot.play();

				/* if damage reached the max */
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

					sounds.coin2.play();
				} else {
					sounds.coin.play();
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

	function createNumberText(str, endStr, alignRight) {
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
			if (alignRight) {
				var l = group.width;
				for (i=0; i < group.length; i++) {
					group.getChildAt(i).x -= l;
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

	function manageSounds() {
		sounds.shot = _.add.audio("shot");
		sounds.reload = _.add.audio("reload");
		sounds.coin = _.add.audio("coin");
		sounds.coin2 = _.add.audio("coin2");

		sounds.bgm = _.add.audio("bgm");
		sounds.bgm.loopFull(1);
	}

	function manageTargets() {

		timer = _.time.events.add(startShowSpeed, repeatInsert, this);
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
		repeatInsert();
		
		function insertTargetDuck() {
			var isInvert = Math.floor(Math.random() * 2);
			var randomDuck = ducks[Math.floor(Math.random() * ducks.length)];
			var randomSticks = sticks[Math.floor(Math.random() * sticks.length)];

			var target 		= createTarget( randomDuck, randomSticks );
			var yAxis		= 250 + (Math.random() * 50);
			var yJump		= yAxis + 20 + (Math.random() * 30);
			var speed 		= 5000 + (Math.random() * 5000);
			var speedUpDown	= 1000 + (Math.random() * 3000);			

			target.y = yAxis;
			target.x = -100;
			var targetX = game.width + 100;
			if (isInvert) {
				target.x = game.width + 100;
				targetX = -100;
				target.target.scale.x = -1;
			}

			panggung.addAt(target, randomPanggungIndex());

			var tw1 = _.add.tween(target).to({ x: targetX }, speed, Phaser.Easing.Linear.None, true).onComplete.add(onTargetFinished);
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

		function onPause() {
			//lgi("PAUSE");
		}
		function onResume() {
			//lgi("RESUME");	
		}
		function onFocus() {
			//lgi("FOCUS");
		}

		/* shot on background (miss shot) */
		stall.bg.inputEnabled = true;
		stall.bg.events.onInputDown.add(onDown);
		function onDown(currentTarget, pointer) {
			if (bullets.shot()) {
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
				/* bekas tembakan di tembok */
				var shot = stall.bggroup.create(pointer.position.x - stall.bg.x, pointer.position.y - stall.bg.y, "objects", "shot_blue_small");
				shot.anchor.set(0.5,0.5);
				shot.alpha = 0.5;

				sounds.shot.play();

				rifle.isShot = true;
			}

			function scaleComplete() {
				crossHair.tweenDownFinish.start();
			}
			function shotComplete() {
				rifle.isShot = false;
			}
		}

		/* scroll to reload */
		game.input.mouse.mouseWheelCallback = mouseWheel;
		var dcount = 0;
		function mouseWheel(event) {
			if (game.input.mouse.wheelDelta == Phaser.Mouse.WHEEL_DOWN) {
				dcount += Math.abs(game.input.mouse.wheelDelta);
				if (dcount >= reloadScrollCount) {
					lgi("RELOAD");
					bullets.reload();
					dcount = 0;
				}
			}
		}
	}	
	function manageBullets() {
		bullets = _.add.group();
		bullets.max = 5;
		bullets.num = 5;
		bullets.type = "silver";
		bullets.long = "short";

		bullets.number = createNumberText(totalBullets.toString(), "_small", true);
		bullets.add(bullets.number);

		bullets.larik = [];
		bullets.alerting = bullets.create(-70, -75, "clickscroll");
		bullets.alerting.visible = false
		bullets.alerting.tween = _.add.tween(bullets.alerting).to({alpha: 0}, 300, Phaser.Easing.Cubic.Out, true, 0, -1, true);
		bullets.alerting.tween.pause();

		var posX = 10;
		for (var i = 0; i < bullets.num; i++) {
			bullets.larik.push(bullets.create(posX, 0, "hud", "icon_bullet_" + bullets.type + "_" + bullets.long));
			posX += 25;
		}

		bullets.shot = function() {
			if (!isGameOver) {
				_.time.events.add(1000, cekGameOver, this);

				/* if target on top of dashboard */
				if ((bullets.num > 0) && (game.input.y < stall.dashboard.y) && (game.input.y > 60)) {
					bullets.larik[bullets.num-1].frameName = "icon_bullet_empty_" + bullets.long;
					bullets.num--;

					return true;
				}

			}
			return false;
		}
		bullets.reload = function() {
			if ((bullets.num < bullets.max) && (totalBullets > 0)) {
				bullets.num += 1;
				bullets.larik[bullets.num-1].frameName = "icon_bullet_" + bullets.type + "_" + bullets.long;
				sounds.reload.play();

				if (bullets.alerting.visible) {
					bullets.alerting.visible = false;
					bullets.alerting.tween.pause();
				}

				/* decreate total bullets */
				if (totalBullets > 0) {
					totalBullets--;
					bullets.number.changeText(totalBullets.toString());
				}
			}
		}
		function cekGameOver() {
			if ((bullets.num <= 0) && (totalBullets <= 0)) {
				showGameOver();
			} else if (bullets.num <= 0) {
				bullets.alerting.visible = true;
				bullets.alerting.tween.resume();
			}
		}
		function setPosition() {
			bullets.x = game.width - 150;
			bullets.y = game.height - 50;
		}
		setPosition();

		/* Hit Area to Click Reload */
		bullets.hitArea = new Phaser.Graphics(_);
		bullets.hitArea.beginFill(0x000000,0);
		bullets.hitArea.drawRect(-90, -80, bullets.width + 40, bullets.height + 120);
		bullets.hitArea.endFill();
		bullets.add(bullets.hitArea);

		bullets.hitArea.inputEnabled = true;
		bullets.hitArea.events.onInputDown.add(reloadBullets);
		function reloadBullets() {
			bullets.reload();
		}
	}

	function showCountDown() {
		var arText = ["ready", "3", "2", "1", "go"];
		var countDown = false;
		function loopCountDown() {
			if (countDown !== false) {
				countDown.destroy();
			}

			if (arText.length > 0) {
				/* show countdown text */
				countDown = createNumberText([arText[0]]);

				countDown.x = game.width / 2;
				countDown.y = game.height / 2;
				countDown.getAt(0).anchor.set(0.5,0.5);
				countDown.getAt(0).position.set(0,0);

				arText.splice(0,1);
				_.add.tween(countDown.getAt(0).scale).to({x: 2, y: 2}, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, true).onComplete.add(loopCountDown);
			} else {
				/* start show targets */
				isGameOver = false;
				manageTargets();
			}
		}
		loopCountDown();
	}

	function showGameOver() {
		if (isGameOver) 
			return;
		isGameOver = true;

		if (timer)
			timer.timer.pause();

		var panel = _.add.group();
		var bg = panel.create(0,0,"panel");

		panel.x = game.width / 2 - panel.width / 2;
		panel.y = game.height / 2 - panel.height / 2;

		var go = panel.create(30,0,"hud", "text_gameover");
		go.x = panel.width / 2 - go.width / 2;
		go.y = 30;

		panel.create(120, 130, "coin_gold");
		var nt = createNumberText(score.toString()); nt.x = 200; nt.y = 135;
		panel.add(nt);

		panel.create(100, 220, "hud", "icon_duck");
		nt = createNumberText(duckPoin.toString(), "_small"); nt.x = 150; nt.y = 220;
		panel.add(nt);

		panel.create(260, 220, "hud", "icon_target");
		nt = createNumberText(targetPoin.toString(), "_small"); nt.x = 310; nt.y = 220;
		panel.add(nt);

		var btHome	= panel.create(110, 360, "bt_home");
		btHome.anchor.set(0.5,0.5);
		zoomEffect(btHome, {x: 1, y: 1});
		btHome.events.onInputUp.add(onHome);

		var btReplay= panel.create(330, 360, "bt_replay");
		btReplay.anchor.set(0.5,0.5);
		btReplay.scale.set(0.9,0.9);
		zoomEffect(btReplay, {x: 0.9, y: 0.9});

		btReplay.events.onInputUp.add(onReplay);
		function onReplay() {
			panel.destroy();
			reset();
		}

		function onHome() {
			panel.destroy();
			reset();
			showTirai();
		}

		function zoomEffect(obj, from) {
			obj.inputEnabled = true;

			obj.events.onInputDown.add(onZoom);
			obj.events.onInputOver.add(onZoom);
			obj.events.onInputOut.add(onZoomOut);
			function onZoom() {
				_.add.tween(obj.scale).to({x: 1.5, y: 1.5}, 400, Phaser.Easing.Quadratic.Out, true);
			}
			function onZoomOut() {
				_.add.tween(obj.scale).to({x: from.x, y: from.y}, 400, Phaser.Easing.Quadratic.In, true);
			}
		}
	}

	function showTirai() {
		isGameOver = true;

		var tirai = _.add.tileSprite(-10,0,game.width + 20, game.height, "tirai");
		var judul = _.add.sprite(game.width / 2, game.height / 2, "judul");
		var btPlay = _.add.sprite(game.width / 2, game.height / 2 + 150, "play");

		tirai.addChild(judul);

		judul.anchor.set(0.5, 1);
		btPlay.anchor.set(0.5, 0.5);
	
		btPlay.inputEnabled = true;
		btPlay.events.onInputOver.add(playOver);
		btPlay.events.onInputOut.add(playOut);
		btPlay.events.onInputUp.add(playUp);	
		function playOver() {
			btPlay.scale.set(1.2,1.2);
			btPlay.tint = 0xffaa11;
		}
		function playOut() {
			btPlay.scale.set(1,1);
			btPlay.tint = 0xffffff;
		}
		function playUp() {
			btPlay.events.onInputOver.remove(playOver);
			btPlay.events.onInputOut.remove(playOut);
			btPlay.events.onInputUp.remove(playUp);
			btPlay.destroy();

			showCountDown();

			tirai.tw1 = _.add.tween(tirai).to({y: -800}, 8000, Phaser.Easing.Linear.None, true).onComplete.add(tiraiPlay);
			tirai.tw2 = _.add.tween(tirai).to({x: 10}, 250, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
		}
		function tiraiPlay() {
			tirai.destroy();
			judul.destroy();
		}
	}


	this.preload = function() {
		lgi("MAIN PRELOAD");
		/* Loader */
		_.add.sprite(game.width/2,game.height/4 * 1.5,"logo").anchor.setTo(0.5, 0.5);
		_.add.sprite(game.width/2,game.height/4 * 3,"loader-white").anchor.setTo(0.5, 0.5);
		var loadingBar = _.add.sprite(game.width/2,game.height/4 * 3,"loader-black");
		loadingBar.anchor.setTo(0.5, 0.5);
		_.load.setPreloadSprite(loadingBar,0);


		_.load.atlasXML('stall', 'assets/spritesheet_stall.png', 'assets/spritesheet_stall.xml');
		_.load.atlasXML('objects', 'assets/spritesheet_objects.png', 'assets/spritesheet_objects.xml');
		_.load.atlasXML('hud', 'assets/spritesheet_hud.png', 'assets/spritesheet_hud.xml');

		_.load.image("stand", "assets/stand.png");
		_.load.image("coin_gold", "assets/coin_gold.png");
		_.load.image("fullscreen-icon", "assets/fullscreen-icon.png");
		_.load.image("panel", "assets/panel.png");
		_.load.image("bt_replay", "assets/replay.png");
		_.load.image("play", "assets/play.png");
		_.load.image("bt_home", "assets/home.png");
		_.load.image("clickscroll", "assets/clickscroll.png");
		_.load.image("tirai", "assets/tirai.png");
		_.load.image("judul", "assets/judul.png");

		_.load.audio("shot", "assets/sounds/barreta_m9-Dion_Stapper-1010051237.mp3");
		_.load.audio("reload", "assets/sounds/reload.mp3");
		_.load.audio("coin", "assets/sounds/coin1.wav");
		_.load.audio("coin2", "assets/sounds/coin2.wav");
		_.load.audio("bgm", "assets/Retro Comedy.ogg");

		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.canvas.oncontextmenu = function (e) { 
			e.preventDefault();
		}

	}
	this.create = function() {
		lgi("MAIN CREATE");
		createGround();
		manageEvents();
		manageSounds();

		manageBullets();

		showTirai();
	}
	this.update = function() {
		if ((game.input.y < stall.dashboard.y) && (game.input.y > 60)) {
			crossHair.position.set(game.input.x, game.input.y);
			rifle.x = game.input.x + 220;
			if (!rifle.isShot)
				rifle.rotation = 0.2 - game.input.y / (game.height - 115) * 0.4;
		}
	}
	this.render = function() {

	}
};var stateBoot = function() {

	function preload() {
		lgi("BOOT PRELOAD");
		game.load.image("logo", "assets/logo.png");
		game.load.image("loader-white", "assets/loader_white.png");
		game.load.image("loader-black", "assets/loader_black.png");

		game.stage.disableVisibilityChange = true;
	}

	function create() {
		lgi("BOOT CREATE");
		game.state.start("main");
	}

	function update() {
		
	}

	function render() {
		
	}

	return {
		preload: preload,
		create: create,
		update: update,
		render: render
	}
};var game = new Phaser.Game(800, 480, Phaser.AUTO, 'game');

game.state.add("boot", new stateBoot());
game.state.add("main", new stateMain());


game.state.start("boot");

document.getElementById("game").onwheel = preventDefault;
document.getElementById("game").onmousewheel = preventDefault;})();