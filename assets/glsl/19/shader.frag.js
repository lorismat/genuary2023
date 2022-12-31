export default /* glsl */`


// created with thebookofshaders editor
// commented are the lines used within the editor


#define PI 3.14159265359;
#define hash21(p) fract(sin(dot(p, vec2(122.9898, 78.2033))) * 43758.5453);

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vUv;


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

float line(vec2 st, float thickness, float posY) {
    float l = step(posY, st.y) - step(posY+thickness, st.y);
    return l;
}

float brush(vec2 st, float thickness, float posY, float nF) {
    float effect = noise(st * 1.) * 10. ;
    float l = step(posY + abs(effect), st.y) - 
        step(posY + thickness + abs(effect), st.y);
    return l;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


float fig(vec2 uv,vec2 offset){
vec2 uuv= uv;
   uv+=offset;
 float d = length(uv)-.052;
    d = smoothstep(.010,.011,d);
    float c = d;

    
    vec2 n = uv;
    float h  = hash21(vec2(1.,1.+.12)+offset);
      
    float at= atan(n.x,n.y);

    float q=length(uv)-(.120+.018*1.+sin(u_time*.33+at*9.+h*h*h*h*exp(mod(1.+7.,14.)))*(.01+.001*1.+h*.008));
    //q = smoothstep(.0040,.0071,abs(q)-.001-sin(u_time+i+at*2.+h*100.)*.005+.003);
    q = smoothstep(0., fwidth(q),abs(q)-.001-sin(u_time+1.+at*2.+h*100.)*.005-.0001);
    d = min(q,d);
    
    
    float lim = .47;
    if(abs(uuv.x) >lim || abs(uuv.y) > lim){
        d=1.;
    }
    d = min(c,d);
    return d;
}

void main() {
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;

    vec2 st = vUv;

    vec2 offset = vec2(0.5,0.5);
    float d = fig(st,offset);
    float e = fig(st,offset*-0.5);
    d  =min(d,e);
    vec3 col = vec3(d);
    col = mix(vec3(.1),vec3(1.,.95,.9),col);
    gl_FragColor = vec4(col,1.0);
}
`;