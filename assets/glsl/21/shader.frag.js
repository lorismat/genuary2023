export default /* glsl */`

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_seed;

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

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = step(_size,
                        _st);
    uv *= step(_size,
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main () {

  vec2 st = vUv;
  vec3 color = vec3(1.);
  vec2 center = vec2(0.5);

  st *= 10.;
  st = fract(st);

  color = mix(
    color, 
    vec3(0.),
    1. - step(0.2, distance(center, st))
  );

  vec2 tr = vec2(
    0.2 * -1. * sign(st.x - 0.5), 
    0.2 * -1. * sign(st.y - 0.5)
  );
  st += tr;
  color = mix(
    color, 
    vec3(0.),
    box(st, vec2(0.2))
  );
  st -= tr;

  
  tr = vec2(
    0.15 * -1. * sign( random(u_seed + vec2(st.x)) - 0.5), 
    0.15 * -1. * sign( random(u_seed + vec2(st.y)) - 0.5)
  );
  st += tr;
  color = mix(
    color, 
    vec3(random(vec2(fract(st.x*10.) + u_seed + 0.1)), random(vec2(fract(st.x*10.) + u_seed + 0.2)), random(vec2(fract(st.x*10.) + u_seed + 0.3))),
    box(st, vec2(0.6))
  );
  st -= tr;
  

  st = vUv;
  st *= 10.;
  tr = vec2(
    0.15 * -1. * sign( random(vec2(u_seed + floor(st.x))) + sin(u_time * 5.)*0.2 - 0.5),
    0.15 * -1. * sign( random(vec2(u_seed + floor(st.y))) + sin(u_time * 5.)*0.2 - 0.5)
  );

  st += tr;
  st = fract(st);

  color = mix(
    color, 
    vec3(random(fract(st.y) + vec2(u_seed + 0.1)), random(fract(st.y) + vec2(u_seed + 0.2)), random(fract(st.y) + vec2(u_seed + 0.3))),
    box(st, vec2(0.3))
  );
  st -= tr;
  
  gl_FragColor = vec4(color, 1.0);
}
`;