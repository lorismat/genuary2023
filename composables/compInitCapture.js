export default function(capturer, format, frameRate) {
  capturer = new Model({
    framerate: frameRate,
    name: `canvas-${Math.random().toFixed(3)}`,
    format: format,
    workersPath: '/libs/'
  });
  capturer.start();
  return capturer
}