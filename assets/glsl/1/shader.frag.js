export default /* glsl */`
varying vec2 vUv;
uniform float time;
void main () {
  gl_FragColor = vec4(vec3(vUv.x, abs(sin(time)), 1.0), 1.0);
}
`;