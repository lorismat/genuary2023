export default /* glsl */`

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;




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

float rect(vec2 st, float X, float Y, float W, float H) {
    float R = step(X, st.x) // x
        - step(1. - Y, 1. - st.y) // Y
        - step(X + W  , st.x) // W depending on X
        //- step(Y + H  +noise(st * 30. + u_time) * 1.5, st.y) // H depending on Y
        //- step(Y + H  +noise(st * 60. + u_time) * 4.5, st.y) // H depending on Y
        - step(Y + H  +noise(st * 1. * sin(u_time)) * 10.5, st.y) // H depending on Y
        ;
    return R;
}

void main() {
    vec2 st = vUv;

    vec3 color = vec3(1.);

    vec2 centerMain = vec2(
        0.5 + 0.2 *  -sin(floor(st.x/10.)*10.+u_time * 2. + 1.5), 
        0.5 + 0.2 *  cos(floor(st.x/10.)*10.+u_time * 2. + 1.5)
    );

    vec2 centerSecond = vec2(
        0.5 + noise(st* 3.)*0.1 + 0.2 * sin(floor(st.x/10.)*10.+u_time * 2.), 
        0.5 + noise(st* 3.)*0.1 + 0.2 * cos(floor(st.x/10.)*10.+u_time * 2.)
    );
    
    float circleMain = step(0.3, distance(st, centerMain));
    float circleSecond = step(0.31, distance(st, centerSecond));
    
    
    color = mix(color, vec3(0.), 
        rect(st, floor(st.x*40.)/40. + 0.009, 0. , 0.07 , 0.5)
       );
    
    color = mix(vec3(0., 0., 0), color, 
        circleSecond
       );
    
    color = mix(vec3(1., 0., 0), color, 
        circleMain
       );    
    
    color = mix(color, vec3(0.), 
        rect(st, floor(st.x*20.)/20., 0.5 , 0.07 , 0.5)
       );
    
    
    color = mix(color, vec3(1.), 
        rect(st, floor(st.x*40.)/40., 0.5 , 0.005  , 0.5)
       );
        
    
    color = mix(color, mix(vec3(0.5,0.,0.), color, circleSecond), 
        rect(st, floor(st.x*20.)/20. + 0.02, 0., 0.05, 1.)
       );
    
    color = mix(color, mix(vec3(1., 0., 0.)*random(st+u_time) * 0.7, color, circleMain), 
        rect(st, floor(st.x*20.)/20. + 0.03, 0., 0.05, 1.)
       );

    color = mix(
      color, 
      mix(color, color, circleMain),
      step(0.5 + noise(st * 10. + u_time) * 0.5, circleMain)
    );

    color = mix(
      color, 
      mix(color, color * random(st), circleSecond),
      step(0.5 + noise(st * 10. + u_time) * 0.5, circleSecond)
    );

   
    
    gl_FragColor = vec4(color,1.0);
}
`;