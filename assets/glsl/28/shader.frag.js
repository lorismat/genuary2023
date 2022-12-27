export default /* glsl */`
uniform vec3 color;
// uniform sampler2D pointTexture;
varying vec3 vColor;
uniform float alphaTest;

void main() {
  gl_FragColor = vec4( color * vColor, 1.0 );
  if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
}
`;