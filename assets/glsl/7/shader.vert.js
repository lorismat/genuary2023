export default /* glsl */`
varying vec2 vUv;
uniform sampler2D texture1;
uniform float u_time;
varying float vAmount;
varying vec3 newPosition;
varying vec3 fPosition;

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
  vUv = uv;

  vec4 col = texture2D(texture1, uv);
  newPosition = position + normal;
  fPosition = position;

  newPosition.y += (col.r + col.g + col.b) * noise(vUv * 0.1 + u_time/2.);

  /*
  newPosition.y = col.r + col.g + col.b < 0.2 ? newPosition.y += noise(vec2(vUv.y)/20. + u_time) / 1.
  : newPosition.y;
  */


  /*
  newPosition.y = col.r + col.g + col.b < 0.4 ? newPosition.y += noise(vUv + u_time) / 10.
  : newPosition.y;
  */

  
  //newPosition.x = col.r + col.g + col.b < 0.4 ? newPosition.x += noise(vUv + u_time) / 1.
  //: newPosition.x;
  /*

  newPosition.z = col.r + col.g + col.b < 0.4 ? newPosition.z += noise(vUv + u_time) / 10.
  : newPosition.z;

  newPosition.x -= noise(vUv + u_time) / 10.;
  // newPosition.y -= noise(vUv + u_time) / 10.;
  */

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;