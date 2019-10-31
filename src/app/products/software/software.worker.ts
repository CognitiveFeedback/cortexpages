/// <reference lib="webworker" />
import { MandelbrotPixels } from './MandelbrotPixels';
import { Point2D } from './Point2D';

addEventListener('message', ({ data }) => {
  let pixels = new MandelbrotPixels(data.imageData);
  let result = pixels.render(data.fromPoint, data.toPoint);
  postMessage({ data: result, message: data.message, maxIterations: pixels.maxIterations });
});
