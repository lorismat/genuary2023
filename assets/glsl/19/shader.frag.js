// Author:
// Title:

#define PI 3.14159265359


#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

float line(vec2 st, float thickness, float posY) {
    float l = step(posY, st.y) - step(posY+thickness, st.y);
    return l;
}

float brush(vec2 st, float thickness, float posY, float nF) {
    float effect = noise(st * 1.) * 10. ;
    float l = step(posY + abs(effect), st.y) - 
        step(posY + thickness + abs(effect), st.y);
    return l;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( sin(0.0)*PI ) * st;
    // move it back to the original place
    st += vec2(0.5);

    vec3 color = vec3(1.);
    
    //color *= random(vec2(floor(st.y*15.)/15.)) - 0.5;
    // 0.0013
    // color = mix(color, vec3(0.), line(st, 0.0013, 0.0001 + floor(st.y*600.)/600.));
    //color = mix(color, vec3(0.), line(st, 0.0019 * random(vec2(st)), 0.0001 + floor(st.y*600.)/600.));
    
    float nF = 10.;
    color = mix(color, vec3(0.), brush(st, 0.013, 0.03 + floor(st.y*nF)/nF, nF));
    
    gl_FragColor = vec4(color,1.0);
}