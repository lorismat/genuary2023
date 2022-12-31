export default /* glsl */`

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

// smooth min implementation and SDF in 2d with circles
// from Inigo Quilez articles!
// smooth min: 
// https://iquilezles.org/articles/smin/
// sdf in 2d:
// https://iquilezles.org/articles/distfunctions2d/

float sdCircle( in vec2 p, in float r ) 
{
  return length(p)-r;
}

float smin(float a, float b, float k) {
  float h = max(k - abs(a-b), 0.) / k;
  return min(a, b) - h*h*h*k*1./6.;
}

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

// CREDIT -- Gradient Noise by Inigo Quilez - iq/2013
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

void main () {

  vec3 col = vec3(1.);

  vec2 p = (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
  vec2 m = (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
  float f = 0.9;

  float d = sdCircle(p,0.4);
  float t = u_time * 0.5;

  float dd = sdCircle(
    m + vec2(
      sin(t * f + 1.)*1.5,
      noise(vUv + t)*1.2
    ),
  0.25);

  float ddd = sdCircle(
    m + vec2(
      cos(t * f + 3.)*1.5,
      noise(vUv + t + 100.)*1.2
    ),
  0.15);

  col = mix(vec3(random(vUv), 0., 0.), col, smoothstep(0.025, 0.03, smin(d,dd,1.0)));
  col = mix(vec3(random(vUv), 0., 0.), col, smoothstep(0.025, 0.03, smin(d,ddd,1.0)));

  col = mix(col, random(vUv) > 0.2 ? vec3(1.) : vec3(0.6, 0., 0.), smoothstep(0.004 + 0.001, 0.004, smin(d,dd,0.3)));
  col = mix(col, random(vUv) > 0.2 ? vec3(1.) : vec3(0.6, 0., 0.), smoothstep(0.004 + 0.001, 0.004, smin(d,ddd,0.3)));
  
  gl_FragColor =  vec4(col,1.0);
  
}
`;