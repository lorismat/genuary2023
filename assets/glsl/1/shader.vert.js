export default /* glsl */`

varying vec3 pos;

varying vec2 vUv;
void main () {
  pos = position;
  vUv = uv;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
}
`;