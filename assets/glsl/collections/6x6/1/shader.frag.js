export default /* glsl */`

varying vec2 vUv;
uniform vec2 u_resolution;
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

  // grainy beige
  vec3 beige = vec3(1., 1., 1.);
  beige *= mix(beige, vec3(0.2), random(st) - 0.9);
  vec3 color = beige;

  // Scale up the space
  // float gridfactor = 1. + round(random(vec2(u_seed)) * 12.);
  float gridfactor = 6.;
  st *= gridfactor;  

  vec2 center = vec2(0.5, 0.5);

  float radiusXL = 0.31;
  float radiusL = 0.3;
  float radiusS = 0.2;
  float radiusXS = 0.1;

  float softGrain = clamp(random(st), 0.8, 1.);

  color = mix(
    color,
    random(vec2(u_seed + floor(st) + 100. )) > 0.5 ?
      softGrain * vec3(random(vec2(u_seed + 2.4 + floor(st))), random(vec2(u_seed + 2.5 + floor(st))), random(vec2(u_seed + 2.6 + floor(st)))) 
      : color,
    smoothstep(radiusXL, radiusXL + 0.003, distance(fract(st), center)) - smoothstep(radiusXL + 0.03, radiusXL + 0.03 + 0.003, distance(fract(st), center))
  );
  
  color = mix(
    fract(st.x) > 0.5 ? 
      softGrain * vec3(random(vec2(u_seed + 0.4 + floor(st))), random(vec2(u_seed + 0.5 + floor(st))), random(vec2(u_seed + 0.6 + floor(st)))) 
      : 
      softGrain * vec3(random(vec2(u_seed + 0.7 + floor(st))), random(vec2(u_seed + 0.8 + floor(st))), random(vec2(u_seed + 0.9 + floor(st)))), 
    color, 
    smoothstep(radiusL, radiusL + 0.003, distance(fract(st), center))
  );

  color = mix(
    fract(st.x) > 0.5 ? 
      softGrain * vec3(random(vec2(u_seed + 1.4 + floor(st))), random(vec2(u_seed + 1.5 + floor(st))), random(vec2(u_seed + 1.6 + floor(st)))) 
      : 
      softGrain * vec3(random(vec2(u_seed + 1.7 + floor(st))), random(vec2(u_seed + 1.8 + floor(st))), random(vec2(u_seed + 1.9 + floor(st)))),
    color, 
    smoothstep(radiusS, radiusS + 0.003, distance(fract(st), center))
  );

  color = random(vec2(u_seed + floor(st))) > 0.5 ? color :

  random(vec2(u_seed + floor(st))) > 0.25 ?

    mix(
      fract(st.x) > 0.5 ? 
        softGrain * vec3(random(vec2(u_seed + 0.1 + floor(st))), random(vec2(u_seed + 0.2 + floor(st))), random(vec2(u_seed + 0.3 + floor(st)))) 
        : color, 
      color, 
      smoothstep(radiusXS, radiusXS + 0.003, distance(fract(st), center))
    )

  :

  mix(
      fract(st.x) < 0.5 ? 
        softGrain * vec3(random(vec2(u_seed + 0.1 + floor(st))), random(vec2(u_seed + 0.2 + floor(st))), random(vec2(u_seed + 0.3 + floor(st)))) 
        : color, 
      color, 
      smoothstep(radiusXS, radiusXS + 0.003, distance(fract(st), center))
    )
  ;
  
  gl_FragColor = vec4(color, 1.0);
}
`;