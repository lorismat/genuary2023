export default /* glsl */`
attribute float size;
attribute vec3 customColor;
attribute vec3 positionP;
attribute vec3 positionPP;
varying vec3 vColor;

uniform float u_time;

varying vec3 pos;

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

void main() {
  vColor = customColor;

  // init: position
  // target: newPosition

  vec3 pos = position;

  float w1 = u_time < 1. ? 1. - u_time : 0.;
  float w2 = u_time < 1. ? u_time : u_time <= 2. ? 2. - u_time : 0.; 
  float w3 = u_time >= 1. && u_time <= 2. ? u_time - 1. : u_time > 2. ? 1. : 0.; 

  pos = position * w1 + positionP * w2 + positionPP * w3;

  /*
  pos.x += u_time > 2. ? noise(pos.xy + u_time) : 0.;
  pos.y += u_time > 2. ? noise(pos.xy + u_time) : 0.;
  pos.z += u_time > 2. ? noise(pos.xy + u_time) : 0.;
  */

  pos.x += noise(pos.xy + u_time)/2.;
  pos.y += noise(pos.xy + u_time)/2.;
  pos.z += noise(pos.xy + u_time)/2.;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

  gl_PointSize = size * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
`;