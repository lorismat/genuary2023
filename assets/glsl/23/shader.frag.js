export default /* glsl */`

varying vec2 vUv;

uniform float u_time;
uniform float u_seed;

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

void main () {

  vec2 st = vUv;

  vec4 color = vec4(vec3(0.), 1.);

  vec2 center = vec2(0.5);
  color = mix(
    color, 
    vec4(0.),
    step(fract(st.x*80.), distance(center, st))
  );
  
  gl_FragColor = color;
}
`;