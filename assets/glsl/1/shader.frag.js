export default /* glsl */`


varying vec2 vUv;
uniform float u_time;

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  vec3 color = vec3(0.98,0.98,0.98); // broken white
    
  float bW = 0.01; // border weight
  float sF = 0.02; // smooth factor
  vec2 bLB = smoothstep(bW, bW + sF, st); // border 
  vec2 bRT = 1. - smoothstep(1.- bW - sF, 1. - bW,st);
  color *= vec3(bLB.x * bLB.y * bRT.x * bRT.y);
  gl_FragColor = vec4(color, 1.);
}
`;