export default /* glsl */`

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float mainSeed;

// random(), random2() by Patricio Gonzalez Vivo | thebookofshaders.com
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

float rect(vec2 st, float x, float y, float W, float H) {
    float R = 1. - (step(x, st.x) + 1. - step(x+W, st.x));
    R *= 1. - (step(y, st.y) + 1. - step(y+H, st.y));
    return R; 
}

void main () {

  vec2 st = vUv;
  st *= fract(st*2.);

  float seed = mainSeed; // attempts with dynamic seed at first    
  vec3 color = vec3(0.);
    
  color = mix(color, vec3(random(vec2(seed)), random(vec2(seed+2.)), random(vec2(seed+1.))), 
              rect(st, 
                   random(floor(st*10.)/1. * random(vec2(seed - 2.))), 
                   random(floor(st*10.)/5. * random(vec2(seed - 4.))), 
                   random(floor(st*10.)/20. * random(vec2(seed - 6.))), 
                   random(floor(st*10.)/1000. * random(vec2(seed - 8.)))
                  )
             );
    
  color = mix(color, vec3(random(vec2(seed+10.)), random(vec2(seed+13.)), random(vec2(seed+11.))), 
              rect(st, 
                   random(floor(st*1.)/100. * sin(seed * 0.0000001) * random(vec2(seed +6.))), 
                   random(floor(st*1.)/500. * sin(seed * 0.0000001) * random(vec2(seed))), 
                   random(floor(st*100.)/20. * sin(seed * 0.0000001) * random(vec2(seed))), 
                   random(floor(st*100.)/10. * sin(seed * 0.0000001) * random(vec2(seed)))
                  )
             );
    
  color = mix(color, vec3(random(vec2(seed+30.)), random(vec2(seed+31.)), random(vec2(seed+33.))), 
              rect(fract(vec2(st.x,st.x)*100.), 
                   random(floor(st*1.)/1. * sin(seed * 0.0000001) * random(vec2(seed +101.))), 
                   random(floor(st*1.)/1. * sin(seed * 0.0000001) * random(vec2(seed +103.))), 
                   random(floor(st*10.)/2. * sin(seed * 0.0000001) * random(vec2(seed +104.))), 
                   random(floor(st*10.)/10. * sin(seed * 0.0000001) * random(vec2(seed +105.)))
                  )
             );
    
  gl_FragColor = vec4(color, 1.);
}
`;