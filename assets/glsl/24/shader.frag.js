export default /* glsl */`

varying vec2 vUv;
varying float t;

uniform vec2 u_resolution;
uniform float u_seed;


// CREDIT 
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

  float factor = 90.;
  st *= factor;

  vec3 color = vec3(1.);

  vec3 col1 = vec3(
        random(vec2(u_seed + 0.1 )) , 
        random(vec2(u_seed + 0.2 )) , 
        random(vec2(u_seed + 0.3 )) 
  );
  vec3 col2 = vec3(
        random(vec2(u_seed + 0.4 )) , 
        random(vec2(u_seed + 0.5 )) , 
        random(vec2(u_seed + 0.6 )) 
  );

  color = 
    fract(st.x) > 0.5 && fract(st.y) > 0.5 ? 
      mix(col1, col2, random(vec2(u_seed + 0.1 ))) :
    fract(st.x) < 0.5 && fract(st.y) > 0.5 ? 
      mix(col1, col2, random(vec2(u_seed + 0.2 ))) : 
    fract(st.x) > 0.5 && fract(st.y) < 0.5 ? 
      mix(col1, col2, random(vec2(u_seed + 0.3 ))): 
    mix(col1, col2, random(vec2(u_seed + 0.4 )));

  color = mix(
    color, 
    vec3(1.),
    smoothstep(fract(st.x), fract(st.x) + 0.1, 0.2) + 1. - smoothstep(fract(st.x), fract(st.x)  + 0.1, 0.8)
  );
  
  gl_FragColor = vec4(color, 1.0);
}
`;