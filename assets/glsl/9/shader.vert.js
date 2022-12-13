export default /* glsl */`
attribute float size;
// varying vec3 pos;

attribute vec3 color;
varying vec3 vColor;

void main() {

  vColor = color;


  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  // pos = position;
  gl_PointSize = size * ( 300.0 / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
`;