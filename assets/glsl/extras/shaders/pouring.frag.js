export default /* glsl */`


varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
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

vec3 modified (vec2 st, float nFreq, float nThick, vec3 colorLine) {
  float t = u_time * 0.4;  
  float noisyPos = noise(105. + t + st * nFreq) * 0.5;
  float noisyInc = noise(vec2(st.x, st.y) * nFreq/12.) * 0.2;

  float position = 0.;
  position += noisyPos * 90. * nThick;
  position += noisyInc * 10. * nThick;

  vec3 line = vec3(0.);
  line += position;
  
  line = fract(line) * 3.;
  return mix(
    // colorLine + fract(st.x*5.), 
    colorLine - 1.,
    vec3(0.9), 
    line  
    );
}

vec3 coloring (vec3 main, vec3 color) {
  main = mix(color*main, main, 0.1);
  main += color / 20.;
  return main;
}

void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  vec3 color = vec3(1.);
    
  vec3 lineB = modified(
      st, // coordinates
      4., // noise frequency
      0.5, // noise thickness
      vec3(0.) // line color
  );

  vec3 lineF = modified(
      st,
      4.,
      0.5,
      vec3(0.)
  );
    
  vec2 center = vec2(0.5);
  float radius = 0.2;
  float smoothing = 0.2;
  // mask for full circle
  float mask = smoothstep(radius, radius + smoothing, distance(center, st));

  color = mix( coloring(lineB , 


    vec3(st.y/3.,0.8,0.6)
    
    
    ) - 0.5, 
    coloring(lineF, 
    
    
    vec3(1., st.x/10., st.x/2.)
    
    
    ) -1.9, 
    mask);
            
  gl_FragColor = vec4(color, 1.0);
}
`;