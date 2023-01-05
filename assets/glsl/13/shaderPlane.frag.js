export default /* glsl */`

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

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

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  vec3 color = vec3(1.);

  color = vec3(0., 0.5, 0.6);

  vec3 colorUp = vec3(1.,0.,0.);

  st.y += noise(st * 40. + u_time * 0.1 ) + 1. * 0.1 * fract(st.x*200.* noise(st + 2.)) * noise(st) * 4.;

  color = mix(
    color -0.4, 
    vec3(0.),
    random(vec2(floor(st.y * 10.), floor(st.x * 400.))) - step(fract(st.y * 10.), random(vec2(floor(st.y * 1.), floor(st.x * 200.))))
  );
  st = vUv;

  colorUp = mix(
    colorUp,
    vec3(1.),
    step(fract(st.y*100.), 0.5)
  );


  colorUp = mix(
    colorUp,
    vec3(1.),
    step(fract(st.x*100.), random(vec2(floor(st.x*100.), floor(st.y*100.))))
  );

  colorUp = mix(
    colorUp,
    vec3(1.),
    step(0.1, distance(st, vec2(0.8))) 
  );

  color = mix(
    color,
    random(st) + 0.8 * colorUp, 
    1.-step(st.y, 0.41)
  );
  
  gl_FragColor = vec4(color, 1.);
}
`;