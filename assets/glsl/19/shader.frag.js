export default /* glsl */`

varying vec2 vUv;
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
  _st *= 10.;
  _st = fract(_st + random(floor(_st)) + u_time);
  vec2 uv = smoothstep(_size, _size + 0.002,
                      _st + noise(_st * 70. + 0.1) * 0.002);
  uv *= smoothstep(_size, _size + 0.002,
                  vec2(1.0)-_st + noise(_st * 70. + 0.2) * 0.002);
  return uv.x*uv.y;
}

float brush(in vec2 _st, float thickness){
  thickness = 0.5 - thickness * 0.5;

  float y = sin(_st.x + random(u_seed * vec2(floor(_st*10.)/ 10.))) ;
  y *= noise(_st + u_time + random(u_seed * vec2(floor(_st*10.)/ 10.))) + random(vec2(floor(_st*10.)/ 10.));

  return  smoothstep( y - thickness * 0.03 - 0.002, y - thickness * 0.03 , _st.y) -
          smoothstep( y + thickness * 0.03, y + thickness * 0.03 + 0.002, _st.y);

}

void main () {

  vec2 st = vUv;
  float softGrain = clamp(random(st), 0.8, 1.);

  vec3 color = softGrain * vec3(0.);

  vec2 translate = vec2(random(vec2(u_seed)) - 0.5, 0.);
  st += translate;  

  color = mix(
    color, 
    pow(softGrain, 0.5) * vec3(noise( 10. + vec2(st.y) * 1000.) * 1.5), 
    box(st, vec2(0.2, 1.2))
  );

  st = vUv;

  translate = vec2(0., random(vec2(u_seed + 1.)) - 0.5);
  st += translate;  

  color = mix(
    color, 
    softGrain * vec3(noise( 10. + vec2(st.y) * 1000.) * 1.5 ), 
    box(st, vec2(1.2, 0.3))
  );

  st = vUv;

  color = mix(
    color, 
    softGrain * vec3(1.), 
    brush(fract(2. + st * 2. + random(vec2(u_seed))), 0.01)
  );

  color = mix(
    color, 
    softGrain * vec3(1.), 
    brush(fract(st*random(vec2(u_seed)) * 5.), 0.01)
  );

  color = mix(
    color, 
    softGrain * vec3(1.), 
    brush(fract(st*random(vec2(u_seed + 2.)) * 5.), 0.01)
  );

  gl_FragColor = vec4(color, 1.0);
}
`;