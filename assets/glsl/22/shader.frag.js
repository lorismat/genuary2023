export default /* glsl */`
uniform float u_time;
varying vec2 vUv;

// random(), random2() by Patricio Gonzalez Vivo | thebookofshaders.com
// noise() by Inigo Quilez | https://www.shadertoy.com/view/XdXGW8
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

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float line(vec2 st, float pct, float thick){
  return  step(pct, st.y) - step(pct + thick * st.y * 0.08, st.y);
}

void main() {
  vec2 st = vUv;

  float y = abs(sin(u_time + st.x + sin(st.x * 10. + noise(st*7.)*1. + 1000.)  / 1.4));
  float y2 = abs(sin(u_time + st.x + sin(st.x * 10. + noise(st*7.)*1. + 1002.)  / 1.4));
  
  vec3 color = vec3(1.);
  
  float pct = line(fract(st), y, 5.);
  float pct2 = line(floor(st*50.)/50., y2, 6.);
      
  color = mix(vec3(0.0), color, (1.0 - pct2) * color + pct2 * vec3(0.6));
  color = (1.0 - pct) * color + pct * vec3(0.1);

  color = mix(color, vec3(0.), 
    step(0.49, distance(vec2(0.5, 0.5), st))
  );

  gl_FragColor = vec4(color,1.0);
}
`;