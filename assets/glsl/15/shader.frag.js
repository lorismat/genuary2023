export default /* glsl */`

// created with thebookofshaders editor
// commented are the lines used within the editor

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 pos;
varying vec3 att;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 seedColor;



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

// CREDIT -- Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
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

  vec3 color = vec3(0.);

  // color = vec3(pos.z-1.);
  color = seedColor;
  
  color = mix(color, vec3(0.), step(st.x, 0.005));
  color = mix(color, vec3(0.), step(1.-st.x, 0.005));

  color *= vec3(att.z/1000.);
  //color /= vec3(pos.z) / 100.;
  gl_FragColor = vec4(color , 1.);
}
`;