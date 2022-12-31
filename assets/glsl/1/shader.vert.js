export default /* glsl */`
varying vec2 vUv;
varying float posZ;

void main () {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  posZ = gl_Position.z;
}
`;