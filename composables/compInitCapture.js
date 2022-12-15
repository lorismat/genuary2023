import * as THREE from 'three';

export default function(capturer, format, clock, frameRate) {
  capturer = new CCapture({
    framerate: frameRate,
    name: `canvas-${Math.random().toFixed(3)}`,
    startTime: 1,
    quality: 0.99,
    motionBlurFrames: 1,
    format: format,
    workersPath: '/libs/'
  });
  capturer.start();
  clock = new THREE.Clock();
  return capturer
}