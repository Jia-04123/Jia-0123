import {
	FileLoader,
	Loader,
	ShapePath
} from '../../../three/three.module.js';

class FontLoader extends Loader {

	constructor(manager) {
		super(manager);
	}

	load(url, onLoad, onProgress, onError) {
		const scope = this;

		const loader = new FileLoader(scope.manager);
		loader.setPath(scope.path);
		loader.setRequestHeader(scope.requestHeader);
		loader.setWithCredentials(scope.withCredentials);
		loader.load(url, function (text) {
			try {
				onLoad(scope.parse(JSON.parse(text)));
			} catch (e) {
				if (onError) {
					onError(e);
				} else {
					console.error(e);
				}

				scope.manager.itemError(url);
			}
		}, onProgress, onError);
	}

	parse(json) {
		const font = new Font(json);
		return font;
	}
}

class Font {

	constructor(data) {
		this.data = data;
		this.type = 'Font';
	}

	generateShapes(text, size = 100) {
		const shapes = [];

		const paths = createPaths(text, size, this.data);

		for (let p = 0, pl = paths.length; p < pl; p++) {
			shapes.push(...paths[p].toShapes(false));
		}

		return shapes;
	}
}

// helper for Font
function createPaths(text, size, data) {
	const scale = size / data.resolution;
	const lineHeight = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;

	const paths = [];

	const offsetX = 0;
	let offsetY = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		if (char === '\n') {
			offsetX = 0;
			offsetY -= lineHeight;
		} else {
			const path = createPath(char, data, scale, offsetX, offsetY);

			paths.push(path);

			offsetX += path.offset;
		}
	}

	return paths;
}

// helper for Font
function createPath(char, data, scale, offsetX, offsetY) {
	const glyph = data.glyphs[char] || data.glyphs['?'];

	if (!glyph) {
		console.error(`FontLoader: character "${char}" does not exist in font.`);
		return;
	}

	const path = new ShapePath();

	let x = 0;
	let y = 0;

	if (glyph.o) {
		const outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));

		for (let i = 0; i < outline.length;) {
			const action = outline[i++];

			switch (action) {
				case 'm': {
					x = parseFloat(outline[i++]) * scale + offsetX;
					y = parseFloat(outline[i++]) * scale + offsetY;
					path.moveTo(x, y);
					break;
				}
				case 'l': {
					x = parseFloat(outline[i++]) * scale + offsetX;
					y = parseFloat(outline[i++]) * scale + offsetY;
					path.lineTo(x, y);
					break;
				}
				case 'q': {
					const cpx = parseFloat(outline[i++]) * scale + offsetX;
					const cpy = parseFloat(outline[i++]) * scale + offsetY;
					x = parseFloat(outline[i++]) * scale + offsetX;
					y = parseFloat(outline[i++]) * scale + offsetY;
					path.quadraticCurveTo(cpx, cpy, x, y);
					break;
				}
				case 'b': {
					const cp1x = parseFloat(outline[i++]) * scale + offsetX;
					const cp1y = parseFloat(outline[i++]) * scale + offsetY;
					const cp2x = parseFloat(outline[i++]) * scale + offsetX;
					const cp2y = parseFloat(outline[i++]) * scale + offsetY;
					x = parseFloat(outline[i++]) * scale + offsetX;
					y = parseFloat(outline[i++]) * scale + offsetY;
					path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
					break;
				}
			}
		}
	}

	return { offset: glyph.ha * scale, path };
}

export { FontLoader };
