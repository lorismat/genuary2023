export default function(capturer, format, frameRate) {
  capturer = new CCapture({
    framerate: frameRate,
    name: `canvas-${Math.random().toFixed(3)}`,
    format: format,
    workersPath: '/libs/'
  });
  capturer.start();
  return capturer
}