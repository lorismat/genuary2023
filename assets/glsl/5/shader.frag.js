export default /* glsl */`
// Author:
// Title:

// #ifdef GL_ES
// precision mediump float;
// #endif

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

float rect(vec2 st, float X, float Y, float W, float H) {
    float R = step(X, st.x) // x
        - step(1. - Y, 1. - st.y) // Y
        - step(X + W, st.x) // W depending on X
        - step(Y + H, st.y) // H depending on Y
        ;
    return R;
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

void main() {

    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;
    vec2 st = vUv;

    vec3 color = vec3(1.);
    vec2 centerMain = vec2(
        0.5 + noise(floor(st/10.)*10.+u_time/3.), 
        0.5 + noise(floor(st/10.)*10.+u_time/3.+1.)
    );
    
    vec2 centerSecond = vec2(
        0.5 + noise(floor(st/10.)*10.+u_time/3.) + noise(floor(st/10.)*10.+u_time/3.)/15. , 
        0.5 + noise(floor(st/10.)*10.+u_time/3.+1.) + noise(floor(st/10.)*10.+u_time/3.)/15.
    );
    
    float circleMain = step(0.2, distance(st, centerMain));
    float circleSecond = step(0.21, distance(st, centerSecond));
    
    color = mix(color, vec3(0.), 
        rect(st, floor(st.x*4.)/4. + 0.09, 0.09, 0.07, 0.82)
       );
    
    color = mix(color, vec3(1.), 
        rect(st, floor(st.x*4.)/4. + 0.1, 0.1, 0.05, 0.8)
       );
    
    color = mix(vec3(0., 0., 0), color, 
        circleSecond
       );
    
    color = mix(vec3(1., 0., 0), color, 
        circleMain
       );    
    
    color = mix(color, vec3(0.), 
        rect(st, floor(st.x*2.)/2. + 0.17, 0.09, 0.07, 0.82)
       );
    
    color = mix(color, vec3(1.), 
        rect(st, floor(st.x*2.)/2. + 0.18, 0.1, 0.05, 0.8)
       );
    
    // working fine but black
    color = mix(color, mix(vec3(1.,0.,0.), color, circleSecond), 
        rect(st, floor(st.x*2.)/2. + 0.18, 0.1, 0.05, 0.8)
       );
    
    // working fine but black
    color = mix(color, mix(vec3(1.)*random(st+u_time/10000.), color, circleMain), 
        rect(st, floor(st.x*2.)/2. + 0.18, 0.1, 0.05, 0.8)
       );
    
    gl_FragColor = vec4(color,1.0);
}
`;