export default /* glsl */`

// created with thebookofshaders editor
// commented are the lines used within the editor

// #ifdef GL_ES
// precision mediump float;
// #endif

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D texture1;

varying vec3 newPosition;
varying vec3 fPosition;

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

float line(vec2 st, float pos) {
  pos += noise(st*5. + u_time ) * 3.;
  float t = abs(noise(st*1. + u_time/4.)) * 3.;
  return step(pos, st.x) + 1. - step(pos - 2., st.x);
}

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  vec3 color = texture2D(texture1, st).rgb;
  

  
  color.r + color.r + color.b < 1.5 ? color += vec3(.0, 0., 0.)
  : color;
  
  float alpha = 1.;
  alpha = 1. - abs(newPosition.y - fPosition.y ) /4.;
  alpha *= step(0., 1.7-newPosition.y );
  alpha *= step(0., 1.7+newPosition.y );


  gl_FragColor = vec4(color, alpha);
}
`;