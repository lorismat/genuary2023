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

float circle(vec2 _st, float radius) {
  float thickness = 0.02;
  vec2 center = vec2(0.5);
  float a = atan(fract(_st.y + noise(vec2(_st.y)) ),fract(_st.x + noise(vec2(_st.x)) ));
  // radius += sin(a*100.)*noise(_st*500.)*.1; // v2
  // radius += sin(a*10.)*noise(_st*1. + u_seed)*.1;
  radius += sin(a*30.)*noise(_st*5. + u_seed)*.05;
  // radius += sin(a*50.)*noise(_st*30. + u_seed)*.02;

  // radius = 
  return 1. - (
    smoothstep(radius, radius+0.01, distance(fract(_st), center)) + 1. - 
    smoothstep(radius-thickness,radius-thickness+0.01, distance(fract(_st), center)));
}

float circleMask(vec2 _st) {
  vec2 center = vec2(
    0.3 + random(vec2(floor(_st.x) + u_seed,floor(_st.y) + u_seed)) * 0.3, 0.3 + random(vec2(floor(_st.y)+u_seed,floor(_st.x)+u_seed)) * 0.3
  ); // 0.2 -- 0.8
  float thickness = 0.03;
  float radius = 0.1 + random(vec2(floor(_st.x) + u_seed,floor(_st.y) + u_seed)) * 0.2;
  return 
    smoothstep(radius,radius+0.01, distance(fract(_st), center)) - 
    smoothstep(radius + thickness,radius+ thickness+0.01, distance(fract(_st), center));
}

float circleMaskBeige(vec2 _st) {
  vec2 center = vec2(
    0.3 + random(vec2(floor(_st.x) + u_seed,floor(_st.y) + u_seed)) * 0.3, 0.3 + random(vec2(floor(_st.y)+u_seed,floor(_st.x)+u_seed)) * 0.3
  ); // 0.2 -- 0.8
  float radius = 0.1 + random(vec2(floor(_st.x) + u_seed,floor(_st.y) + u_seed)) * 0.2;
  return 1. - 
    smoothstep(radius, radius + 0.01, distance(fract(_st), center));
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

  for (float i = 1. ; i < 3. ; i++) {
    color = mix(
      color, 
      vec3(0.02),
      circle(st, 0.25 + i * 0.04) // 0.3, 0.2
    );
  }

  
  
  color = mix(
    color, 
    vec3(0.02),
    circleMask(st)
  );

  color = mix(
    color, 
    beige,
    circleMaskBeige(st)
  );

  
  
  
  gl_FragColor = vec4(color, 1.0);
}
`;