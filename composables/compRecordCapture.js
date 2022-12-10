
export default function(capturer, canvas, recordingStop, delta, threshold) {
  // const delta = clock.getElapsedTime();
  capturer.capture(canvas);
  // one cycle goes from 0 to 2*PI with sines
  // one cycle output goes from 0 to 1 with fract
  if ( delta >= threshold ) {
    capturer.stop();
    capturer.save();
    recordingStop++;
  }

  return recordingStop;
}