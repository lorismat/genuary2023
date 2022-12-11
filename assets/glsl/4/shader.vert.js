export default /* glsl */`

// size and colors from offical three.js example
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_custom_attributes_points2.html

attribute float size;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = size * ( 300.0 / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;

}
`;