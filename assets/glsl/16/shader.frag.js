export default /* glsl */`
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;

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

vec3 modified (vec2 st, float nFreq, float nThick, vec3 colorLine) {
  float t = u_time * 0.2;
  
  float noisyPos = noise(t + st * nFreq) * 0.2;
  float noisyInc = noise(vec2(st.x, st.x) * nFreq/2.) * 0.2;
  float noisyExt = noise(vec2(st.y, st.y) * nFreq/2.) * 0.01;
  
  float position = 0.;
  position += noisyPos * 100. * nThick;
  position += noisyInc * 100. * nThick;
  position += noisyExt * 100. * nThick;

  vec3 line = vec3(step(1. - position, st.y) + 
                  1. - step(1. - position,st.y));

  line += position ;
  line = fract(line) * 10.;
  return mix(colorLine, vec3(1.), line);
}

vec3 coloring (vec3 main, vec3 color) {
  main = mix(color, main, 0.1);
  return main;
}

void main () {
  vec2 st = vUv;
  vec3 color = vec3(1.);
    
  vec3 lineB = modified(
      st, // coordinates
      3., // noise frequency
      0.9, // noise thickness
      vec3(0.) // line color
  );

  vec3 lineF = modified(
      st,
      3.,
      0.5,
      vec3(0.9)
  );
    
  vec2 center = vec2(0.5);
  float radius = 0.25;
  float smoothing = 0.05;
  // mask for full circle
  float mask = smoothstep(radius, radius + smoothing, distance(center, st));
  // mask to split circle in parts
  float mask2 = mix(mask, 1., step(st.x, floor(st.x*10.)/10. + 0.02) + 1. - step(st.x, floor(st.x*10.)/10. + 0.1));

  color = mix(coloring(lineB, vec3(st.x,random(st)*0.4, st.y)), coloring(lineF, vec3(st.y, st.x, 0.6 + random(st))) -0.8, mask2);
          
  gl_FragColor = vec4(color, 1.0);
}
`;