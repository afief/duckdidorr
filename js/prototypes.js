var lg 		= console.log.bind(console);
var lgi 	= console.info.bind(console);
var lgw 	= console.warn.bind(console);
var lge 	= console.error.bind(console);

function pointerDistance(p1, p2) {

	function sqr(n) {
		return n * n;
	}

	return Math.sqrt(sqr(p2.x - p1.x) + sqr(p2.y - p1.y));

}