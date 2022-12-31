export default /* glsl */`
varying vec2 vUv;
varying float posZ;
uniform float u_time;

void main () {
  vec2 st = vUv;
  vec3 color = vec3(0.98,0.98,0.98);
    
  float bW = 0.01; // border weight
  float sF = 0.02; // smooth factor
  vec2 bLB = smoothstep(bW, bW + sF, st); // border 
  vec2 bRT = 1. - smoothstep(1.- bW - sF, 1. - bW,st);
  color *= vec3(bLB.x * bLB.y * bRT.x * bRT.y);

  // custom mapping with world coordinates from vertex shader
  // for fading effect
  float alpha = (posZ + 35.)/35. * 3.14/2.;

  gl_FragColor = vec4(color * sin(alpha), sin(alpha) * 2.);
}
`;