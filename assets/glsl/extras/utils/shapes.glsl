
float rect(vec2 st, float X, float Y, float W, float H) {
    float R = step(X, st.x) // x
        - step(1. - Y, 1. - st.y) // Y
        - step(X + W, st.x) // W depending on X
        - step(Y + H, st.y) // H depending on Y
        ;
    return R;
}

float line(vec2 st, float thickness, float posY) {
    float l = step(posY, st.y) - step(posY+thickness, st.y);
    return l;
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

// random(), random2() by Patricio Gonzalez Vivo | thebookofshaders.com
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

// rotate function
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
// rotate in frag
// move space from the center to the vec2(0.0)
st -= vec2(0.5);
// rotate the space
st = rotate2d( sin(PI/6.)* PI) * st;
// move it back to the original place
st += vec2(0.5);

// borders
float thickness = 0.01;
color = mix(color, vec3(1.), step(1.-thickness, st.x) + 1. - step(thickness, st.x));
color = mix(color, vec3(1.), step(1.-thickness, st.y) + 1. - step(thickness, st.y));

// PI 3.14159265359