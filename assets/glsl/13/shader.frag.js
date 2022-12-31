export default /* glsl */`

// created with thebookofshaders editor
// commented are the lines used within the editor

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D texture1;


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

float line(vec2 st, float thickness, float posY) {
    float l = step(posY, st.y) - step(posY+thickness, st.y);
    return l;
}

float rect(vec2 st, float X, float Y, float W, float H) {
    float R = step(X, st.x) // x
        - step(1. - Y, 1. - st.y) // Y
        - step(X + W, st.x) // W depending on X
        - step(Y + H, st.y) // H depending on Y
        ;
    return R;
}


void main () {

  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec2 st = vUv;

  // vec3 color = texture2D(texture1, st).rgb;

  // ex 1: replace black by red
  // ex 2: give less importance to grayish (black is blacker, white is whiter)
  // ex 3: grid
  // ex 4: pixellisation
  // ex 5: rounded pixels
  // ex 6: curvy lines

  /* ex 1
  color.g = 0.;
  color.r = 1. - (1. * color.r);
  color.b = 0.;
  */ 

  /* ex 2
  color.g = 0.;
  color.r = pow(1. - (1. * color.r), 10.);
  color.b = 0.;
  */

  /* ex 3
  color.g = 0.;
  color.r = pow(1. - (1. * color.r), 10.);
  color.b = 0.;

  st *= 100.;
  st = fract(st);
  float thickness = 0.1;

  color = mix(color, vec3(1.), step(1.-thickness, st.x) + 1. - step(thickness, st.x));
  color = mix(color, vec3(1.), step(1.-thickness, st.y) + 1. - step(thickness, st.y));
  */

  /* ex 4

  float dx = 12.*(1./1024.);
  float dy = 12.*(1./1024.);
  vec2 coord = vec2(dx*floor(st.x/dx),
                   dy*floor(st.y/dy));
  gl_FragColor = texture2D(texture1, coord);
  */

  /* ex 5
  vec3 color = vec3(1.);

  float dx = 3.*(1./512.);
  float dy = 3.*(1./512.);
  vec2 coord = vec2(dx*floor(st.x/dx),
                  dy*floor(st.y/dy));

  color = texture2D(texture1, coord).xyz;

    
  color.r < 0.99 ? color = mix(
    vec3(0.6), 
    vec3(1.), 
    step(0.4 - 0.4 * color.r, distance(vec2(0.5, 0.5), fract(st/dx) ))
    ) : color = vec3(1.) ;
    */

    vec3 color = vec3(1.);

float dx = 3.*(1./512.);
float dy = 3.*(1./512.);
vec2 coord = vec2(dx*floor(st.x/dx),
                dy*floor(st.y/dy));

color = texture2D(texture1, coord).xyz;

  
color.r < 0.99 ? color = mix(
  vec3(0.6), 
  vec3(1.), 
  step(0.4 - 0.4 * color.r, distance(vec2(0.5, 0.5), fract(st/dx) ))
  ) : color = vec3(1.) ;

  color *= mix(
    color, 
    vec3(0.2), 
    rect(st, 0.5 + 0.3*noise(st), 0.25, 0.01, 0.5) 
  );

  gl_FragColor = vec4(color, 1.);
}
`;