export default /* glsl */`


// created with thebookofshaders editor
// commented are the lines used within the editor

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

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

// base grid
float lineBase(float stCoord, float thickness, float gridFactor) {
    float scl = floor(stCoord * gridFactor) /  gridFactor;
    return step(scl+thickness, stCoord)  + 1. - step(scl-thickness, stCoord);
}

// part 2
float line(vec2 st, float stCoord, float thickness, float gridFactor, float offset) {
    float scl = floor(stCoord * gridFactor) /  gridFactor + offset;
    
    
    scl += noise(st * pow(stCoord, 4.) * 0.6 + u_time * 0.2) * 0.05;
    scl += noise(st * pow(stCoord, 4.) * 0.1 + u_time * 0.1) * 0.009;
    
    float base = smoothstep(scl + thickness, scl + thickness + 0.001, stCoord) 
    + 1. - smoothstep(scl - thickness - 0.001, scl - thickness, stCoord);
    return base;
}

void main() {
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;
    vec2 st = vUv;
    vec3 color = vec3(1.);
    
    st *= 2.;
    
    float thickness = 0.002;
    float gridFactor = 12.;
    float offset = 0.06;
    
    color *= line(st, st.y, thickness, gridFactor, offset);
    color *= line(st, st.x, thickness, gridFactor, offset);

    gl_FragColor = vec4(color,1.0);
}
`;