export default /* glsl */`
varying vec2 vUv;
uniform vec2 u_resolution;
varying vec3 pos;
uniform vec3 _color;

void main () {
  vec2 st = vUv;
  float radius = 0.3;
  float margin = 0.02;
  st -= margin;
  vec3 color = vec3(1.);
  vec2 center = vec2(floor(pos.x*1.)/1. + radius, floor(pos.y*1.)/1. + radius);
  vec4 newColor = mix(vec4(color, 1.), vec4(_color, 1.), step(radius, distance(center, pos.xy)));

  gl_FragColor = vec4(newColor);
}
`;