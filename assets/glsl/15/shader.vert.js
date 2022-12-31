export default /* glsl */`
varying vec2 vUv;
varying vec3 pos;
varying vec3 att;

void main () {
  vUv = uv;
  pos = position;

  // instancing shader position
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  att = gl_Position.xyz;
}
`;