export default /* glsl */`
varying vec2 vUv;

void main () {
  vec2 st = vUv;

  vec3 color = vec3(1.);

  
  gl_FragColor = vec4(color, 1.0);
}
`;