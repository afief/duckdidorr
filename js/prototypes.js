var lg 		= console.log.bind(console);
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
}