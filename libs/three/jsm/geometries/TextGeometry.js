import { ExtrudeGeometry } from '../../../three/three.module.js';

class TextGeometry extends ExtrudeGeometry {
	constructor(text, parameters = {}) {
		const font = parameters.font;

		if (font === undefined) {
			super(); // generate default extrude geometry
		} else {
			const shapes = font.generateShapes(text, parameters.size);

			// defaults
			if (parameters.depth === undefined) parameters.depth = 50;
			if (parameters.bevelThickness === undefined) parameters.bevelThickness = 10;
			if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
			if (parameters.bevelEnabled === undefined) parameters.bevelEnabled = false;

			super(shapes, parameters);
		}

		this.type = 'TextGeometry';
	}
}

export { TextGeometry };

