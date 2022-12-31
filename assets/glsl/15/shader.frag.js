export default /* glsl */`

varying vec2 vUv;
varying vec3 pos;
varying vec3 att;
uniform vec3 seedColor;

void main () {
  vec2 st = vUv;
  vec3 color = vec3(0.);
  color = seedColor;
  
  color = mix(color, vec3(0.), step(st.x, 0.005));
  color = mix(color, vec3(0.), step(1.-st.x, 0.005));

  color *= vec3(att.z/1000.);
  gl_FragColor = vec4(color , 1.);
}
`;