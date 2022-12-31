export default /* glsl */`
varying vec2 vUv;
uniform sampler2D texture1;

varying vec3 newPosition;
varying vec3 fPosition;

void main () {
  vec2 st = vUv;
  vec3 color = texture2D(texture1, st).rgb;
  
  
  color.r + color.r + color.b < 1.5 ? color += vec3(.0, 0., 0.)
  : color;
  
  float alpha = 1.;
  alpha = 1. - abs(newPosition.y - fPosition.y ) /4.;
  alpha *= step(0., 1.7-newPosition.y );
  alpha *= step(0., 1.7+newPosition.y );

  gl_FragColor = vec4(color, alpha);
}
`;