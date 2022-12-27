export default /* glsl */`
uniform sampler2D tDiffuse;
uniform float amount;
uniform float angle;
varying vec2 vUv;

float random (vec2 st) {
    
    return fract(sin(dot(st.xy,
                        vec2(12.9808,78.233)))*
      43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

void main() {
  vec2 offset = amount * vec2( cos(angle), sin(angle));
  vec4 cr = texture2D(tDiffuse, vUv + offset);
  vec4 cga = texture2D(tDiffuse, vUv);
  vec4 cb = texture2D(tDiffuse, vUv - offset);

  vec3 color = texture2D(tDiffuse, vUv).rgb;
  color *= random(vUv);
  gl_FragColor = vec4(color, 1.);
}
`;