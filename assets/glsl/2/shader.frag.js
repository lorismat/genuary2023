export default /* glsl */`

// created with thebookofshaders editor
// commented are the lines used within the editor

// #ifdef GL_ES
// precision mediump float;
// #endif

varying vec2 vUv;
uniform float u_time;

uniform float smoothFactor;
uniform float lineNumber;
uniform float lineThickness;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

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

// Gradient Noise by Inigo Quilez - iq/2013
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

vec3 modified (vec2 st, float position, float thickness, float sign, float noiseAmplitude) {
  float t = u_time * 0.1;

  float noisyPos = noise(t + st * noiseAmplitude) * noiseAmplitude * 2.;
  float noisyInc = noise(t + vec2(st.x, st.x) * 10.) * noiseAmplitude * 0.1;
  float noisyExt = noise(t + vec2(st.y, st.y) * 10.) * 0.01;
  
  position += noisyPos * sign;
  position += noisyInc * sign;
  position += noisyExt * sign;

  vec3 line = vec3(smoothstep(1.- position - smoothFactor, 1.- position, st.y) + 
                   1. - smoothstep(1. - position - thickness - smoothFactor, 1. - position - thickness,st.y));
  return line;
}

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  // h
  float h = 0./360.;
  float hL = 174./360.;
  // s
  float s = 0.68;
  float sL = 1.;
  // b
  float b = 0.24;
  float bL = 0.71;

  // gb color
  vec3 color = hsb2rgb(vec3(h + random(st) * 0.1, s, b));
  // line color
  vec3 colorLine = hsb2rgb(vec3(hL + random(st) * 0.1, sL, bL));

  vec3 modifiedLine = modified(
    st, // st
    0.5, // position
    lineThickness, // thickness
    1., // sign
    3. // noiseAmplitude
  );

  color = mix(colorLine, color, modifiedLine);
  gl_FragColor = vec4(color, 1.0);
}

`;