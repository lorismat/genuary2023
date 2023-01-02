export default /* glsl */`

#define PI 3.14159265359


varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform int arrLength;
uniform float idx[1000];

// CREDIT 
// random(), random2(), rotate2d, box, by Patricio Gonzalez Vivo | thebookofshaders.com
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

  vec3 palette[5] = vec3[](
    vec3(0.047,0.514,0.227) * vec3(1.2),
    vec3(0.082,0.31,0.69) * vec3(1.2),
    vec3(0.769,0.631,0.) * vec3(1.2),
    vec3(0.451,0.,0.059) * vec3(1.2),
    vec3(0.008,0.004,0.024) * vec3(1.2)
  );

  // palette
  // green #0c833a vec3(0.047,0.514,0.227)
  // blue #154fb0 vec3(0.,0.098,0.451)
  // yellow #c4a100 vec3(0.769,0.631,0.)
  // red #73000f vec3(0.451,0.,0.059)
  // black #020106 vec3(0.008,0.004,0.024)

  // grainy beige
  vec3 beige = vec3(1., 1., 0.95);
  beige *= mix(beige, vec3(0.2), random(st) - 0.7);

  vec3 color = beige;

  // Scale up the space
  float gridfactor = 1.5;
  st *= gridfactor;  

  float softGrain = clamp(random(st), 0.8, 1.);

  // anarchic squares
  for(int i=0;i<arrLength;++i) {

    // rotate coordinates
    st = rotate2d( sin(random(vec2(idx[i] + 0.1)) * PI * 2.) ) * fract(st);

    // translate coordinates
    vec2 translate = vec2( random(vec2(idx[i] + 0.1 + floor(st))) * 0.8 - 0.4, random(vec2(idx[i] + 0.2 + floor(st))) * 0.8 - 0.4);
    st += translate;
    color = mix(
      color, 
      // softGrain * vec3( random(vec2(idx[i] + 0.2 ) + floor(st)) , random(vec2(idx[i] + 0.3 + floor(st))) , random(vec2(idx[i] + 0.4  + floor(st))) ), 
      softGrain * palette[int( float(palette.length() -1) * random(0.2 + floor(st) +vec2(idx[i])))],  
      box(fract(st), vec2(idx[i]*0.8 + 0.05 , 0.05 + idx[i]* 0.05) ) 
    );
    st -= translate;
  }
  
  // circle mask
  float radiusMask = 0.3;
  vec2 centerMask = vec2(0.5, 0.5);
  color = mix(color, beige, smoothstep(radiusMask, radiusMask + 0.003, distance(fract(st), centerMask)));

  // one circle
  float radiusExtra = random(floor(st) + idx[0]) * 0.2 + 0.05;
  vec2 centerExtra = vec2(random(floor(st) + idx[0]), random(floor(st + 100.) + idx[0]));
  
  color = mix(
    softGrain * palette[int( float(palette.length() -1) * random(0.2 + floor(st) + vec2(idx[0])))],
    // softGrain * vec3( random(vec2(idx[0] + 0.2 ) + floor(st)), random(vec2(idx[0] + 0.3 + floor(st))), random(vec2(idx[0] + 0.4  + floor(st))) ),
    color, 
    smoothstep(radiusExtra, radiusExtra + 0.003, distance(fract(st), centerExtra))
  );

  // 3 lines horizontal
  for(int i=0;i<3;++i) {
    // translate coordinates
    vec2 translate = vec2( 0., random(vec2(idx[i] + 0.2 + floor(st))) * 0.8 - 0.4);
    st += translate;

    color = mix(color, softGrain * palette[palette.length()-1], 
      box(fract(st), vec2(idx[i]*0.8 + 0.05 , 0.01) ) 
    );
    st -= translate;
  }

  // 2 lines vertical
  for(int i=0;i<2;++i) {
    // translate coordinates
    vec2 translate = vec2( random(vec2(idx[i] + 0.2 + floor(st))) * 0.8 - 0.4, 0.);
    st += translate;

    color = mix(color, softGrain * palette[palette.length()-1], 
      box(floor(st), vec2(0.01 , 1.) ) 
    );
    st -= translate;
  }


  // rotated rectangles 
  for(int i=0;i<1;++i) {
    // translate coordinates
    vec2 translate = vec2( random(vec2(idx[i] + 0.1 + floor(st))) * 0.8 - 0.4, random(vec2(idx[i] + 0.2 + floor(st))) * 0.8 - 0.4);
    st += translate;

    // rotate coordinates
    st = rotate2d( sin(random(vec2(idx[i] + 0.1 + floor(st.x))) * PI * 2.) ) * fract(st);
    
    color = mix(
      color, 
      softGrain * palette[int( float(palette.length() -1) * random(0.2 + floor(st)))],
      box(fract(st), vec2(idx[i]*0.8 + 0.05 , 0.05 + idx[i]* 0.05) ) 
    );
    // st -= translate;
  }

  st = rotate2d( sin(random(vec2(idx[0] + 0.1 + floor(st.y))) * PI * 4.) ) * fract(st);

  // borders
  // resetcoordinates
  float thickness = 0.006 * gridfactor;
  // st = vUv;
  st *= gridfactor;
  color = mix(color, vec3(0.), step(1.-thickness, fract(st.x)) + 1. - step(thickness, fract(st.x)));
  color = mix(color, vec3(0.), step(1.-thickness, fract(st.y)) + 1. - step(thickness, fract(st.y)));

  gl_FragColor = vec4(color, 1.0);
}
`;