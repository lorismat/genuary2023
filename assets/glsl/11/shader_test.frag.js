export default /* glsl */`

// created with thebookofshaders editor
// commented are the lines used within the editor

#define PI 3.14159265359


varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform int arrLength;
uniform float idx[1000];

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

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main () {

  
  vec2 st = vUv;
  st *= 1.0;      // Scale up the space by 3
  

  vec3 color = vec3(1.);

  // anarchic squares
  for(int i=0;i<arrLength;++i) {
    // translate coordinates
    vec2 translate = vec2( random(vec2(idx[i] + 0.1)) * 0.8 - 0.4, random(vec2(idx[i] + 0.2 )) * 0.8 - 0.4);
    st += translate;
    // rotate coordinates
    st -= vec2(0.5);
    st = rotate2d( sin(random(vec2(idx[i] + 0.1)) * PI * 2.) ) * st;
    st += vec2(0.5);

    color = mix(color, vec3( random(vec2(idx[i] + 0.2 )) , random(vec2(idx[i] + 0.3 )) , random(vec2(idx[i] + 0.4 )) ), 
      box(st, vec2(idx[i]*0.8 + 0.05 , 0.05 + idx[i]* 0.05) ) 
    );
    // reset coordinates system
    st = fract(st);
  }

  float radius = 0.3;

  // circle mask
  vec2 center = vec2(0.5, 0.5);
  color = mix(color, vec3(1.), smoothstep(radius, radius + 0.003, distance(st, center)));

  // 3 lines
  for(int i=0;i<3;++i) {
    // translate coordinates
    vec2 translate = vec2( 0., random(vec2(idx[i] + 0.2 )) * 0.8 - 0.4);
    st += translate;

    color = mix(color, vec3(0.1), 
      box(st, vec2(idx[i]*0.8 + 0.05 , 0.01) ) 
    );
    // reset coordinates system
    st = fract(st);
  }

  

  gl_FragColor = vec4(color, 1.0);
}
`;