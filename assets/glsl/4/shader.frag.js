export default /* glsl */`
uniform vec3 color;

// size helper from the offical three.js example
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_custom_attributes_points2.html

void main() {
  if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
  gl_FragColor = vec4( color, 1.0 );

}
`;