export default /* glsl */`

varying vec2 vUv;
varying vec3 pos;
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

float brush(in vec2 _st, in vec2 _size){
  _size = vec2(0.5) - _size*0.5;

  _size += noise(_st * 100. + u_seed) * 0.004;

  _size.y += noise(_st * 5. + u_seed) * 0.01;

  _size.y += noise(_st * 1. + 1.1) * 0.07;
  
  _size.x += noise(_st * 10. + u_seed) * 0.05;

  float noisy = noise(_st * 3. + u_seed) * 0.02;
  noisy += noise(_st * 30. + u_seed) * 0.01;
  noisy += noise(_st * 70. + u_seed) * 0.003;

  vec2 uv = smoothstep(_size, _size + 0.002,
                      _st + noisy);
  uv *= smoothstep(_size, _size + 0.002,
                  vec2(1.0)-_st + noisy);
  return uv.x*uv.y;
}

float circle(vec2 _st, float radius, float thickness, vec2 pos) {
  vec2 center = pos;
  float smoothFactor = 0.003;
  return smoothstep(radius, radius + smoothFactor, distance(_st, center)) 
    + 1. - smoothstep(radius - thickness, radius - thickness + smoothFactor, distance(_st, center));
}

void main () {

  vec2 st = vUv;
  
  vec3 color = vec3(1.);
  vec3 beige = random(st) + 0.9 * vec3(1., 1, 0.98);

  // main
  vec3 black = vec3(0.1);
  

  // CANVAS BACKGROUND
  float width = 0.6;
  float height = 0.8;
  float thickness = 0.01;
  float sF = 0.0002; // smooth factor

  // borders for background
  vec2 bLB = smoothstep(thickness, thickness + sF, st); // border 
  vec2 bRT = 1. - smoothstep(1.- thickness - sF, 1. - thickness,st);

  // border mask
  
  color = mix(
    color,
    black,
    box(st, vec2(width + thickness, height + thickness)) * vec3(bLB.x * bLB.y * bRT.x * bRT.y)
  ); 
  

  // noisy canvas
  color = mix(
    color, 
    beige,
    box(st, vec2(width, height)) 
  ); 

  // black brush
  color = mix(
    
    vec3(color),
    beige * random(vec2(st)) * pow((1.4-st.x), 40.),
    
    // vec4(vec4(random(vec2(st)) * pow((1.45-st.x), 30.))), 
    brush(st, vec2(0.5, 0.05))
  );

  

  // lines
  float lineThickness = 0.003;
  float lineHeight = 0.3;
  float lineFactor = 20.; 
  int lineNumber = 3;
  
  for(int i=0;i<lineNumber;++i) {
    st += vec2(
      random(vec2(u_seed) ) * 0.3 - 0.15 + float(i)/30., // -0.3 > 0.3
      random(vec2(u_seed) + 1. ) * 0.2 - 0.1// -0.2 > 0.2
    );
    color = mix(
      color, 
      black,
      box( st, vec2(lineThickness, 0.2 + lineHeight * random(vec2(u_seed + float(i)) ) )) 
    );
    st = vUv;
  }

  // circles
  int circleNumbers = 3;
  for(int i=0;i<circleNumbers;++i) {
    float r = 0.04;
    color = mix(
      black,
      color, 
      circle(st, r, 0.002, 
        vec2( 
          0.3 + 0.4 * random( 1. + vec2(u_seed)) , 
          0.2 + 0.5 * random(vec2(u_seed)) + 0.03 * float(i)
        )
      )
    );
  }

  

  
  

  gl_FragColor = vec4(color, 1.);
}
`;