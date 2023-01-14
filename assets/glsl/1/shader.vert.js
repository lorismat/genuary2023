export default /* glsl */`
varying vec2 vUv;
varying float posZ;

void main () {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  vUv = uv;
  posZ = gl_Position.z;
}
`;