export default /* glsl */`

// Created with http://editor.thebookofshaders.com/
// Commented lines are the lines used within the editor
// #ifdef GL_ES
// precision mediump float;
// #endif

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;

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
    
    // fract
    // mix
    // multiply
    // add
    
    // create one line
    // create grid
    // add a square changing on top
    // create a mask made of 10 rectangle, offest
    
    float sclX = floor(st.x*10.) / 10.;
    float sclY = floor(st.y*10.) / 10.;
    
    float lineX = step(sclX+0.01, st.x)  + 1. - step(sclX-0.01, st.x);
    float lineY = step(sclY+0.01, st.y)  + 1. - step(sclY-0.01, st.y);
    
    color *= lineX;
    color *= lineY;
    
    float shape = step(st.x, 0.5);
    
    color = mix(color, vec3(1.,0.,0.), shape);
    
    gl_FragColor = vec4(color, 1.0);
}


`;