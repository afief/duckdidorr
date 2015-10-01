var stateBoot = function() {

	function preload() {
		lgi("BOOT PRELOAD");
		game.load.image("logo", "assets/logo.png");
		game.load.image("loader-white", "assets/loader_white.png");
		game.load.image("loader-black", "assets/loader_black.png");
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
}