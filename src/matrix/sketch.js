var w = window.innerWidth;
var h = window.innerHeight;
var symbolSize = 18;
var streams = [];
const fillGreen = () => fill(180, 255, 180);
const fillBrightGreen = () => fill(0, 255, 50);
const shadowGreen = () => color(180, 255, 180);
const shadowBlur = 20;

function setup() {
	createCanvas(w, h);
	background(0);
	textSize(symbolSize);
	textStyle(BOLD);

	let x = 0;
	for (let i = 0; i <= width / symbolSize; i++) {
		let stream = new Stream();
		stream.generateSymbols(x, random(-400, 400));
		streams.push(stream);
		x += symbolSize;
	}

	fullScreen();
}

function draw() {
	drawingContext.shadowBlur = shadowBlur;
	drawingContext.shadowColor = shadowGreen();
	background(0);
	// background(0, 150)
	streams.forEach((stream) => {
		stream.render();
	});
}

class Symb {
	constructor(x, y, speed, first) {
		this.x = x;
		this.y = y;
		this.value;
		this.speed = speed;
		this.switchInterval = round(random(20, 50));
		this.first = first;
	}

	setToRandomSymbol() {
		if (frameCount % this.switchInterval === 0) {
			this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
		}
	}

	rain() {
		this.y = this.y >= height ? 0 : (this.y += this.speed);
	}
}

class Stream {
	constructor() {
		this.symbols = [];
		this.totalSymbols = round(random(5, 30));
		this.speed = random(2, 10);
	}

	render() {
		this.symbols.forEach((symbol) => {
			if (symbol.first) {
				fillGreen();
			} else {
				fillBrightGreen();
			}
			text(symbol.value, symbol.x, symbol.y);
			symbol.rain();
			symbol.setToRandomSymbol();
		});
	}

	generateSymbols(x, y) {
		let first = round(random(0, 3)) === 1;
		for (let i = 0; i <= this.totalSymbols; i++) {
			let symbol = new Symb(x, y, this.speed, first);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize;
			first = false;
		}
	}
}

function fullScreen() {
	let fullscreenOn = false;
	document.addEventListener('keypress', async (e) => {
		console.log('A', e);
		if (e.key === 'f' || e.key === 'F') {
			if (!fullscreenOn) {
				await openFullscreen();
				fullscreenOn = true;
				w = window.innerWidth;
				h = window.innerHeight;
				resizeCanvas(w, h);
			} else {
				document.exitFullscreen();
				fullscreenOn = false;
			}
		}
	});
	/* Get the element you want displayed in fullscreen mode (a video in this example): */
	const elem = document.querySelector('canvas');

	/* When the openFullscreen() function is executed, open the video in fullscreen.
    Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
	function openFullscreen() {
		if (elem.requestFullscreen) {
			return elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) {
			/* Safari */
			return elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			/* IE11 */
			return elem.msRequestFullscreen();
		}
	}
}
