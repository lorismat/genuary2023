export default /* glsl */`


// created with thebookofshaders editor
// commented are the lines used within the editor

// direct inspiration for the eclipse effect: 
// Light Circles by Deefunct
// https://www.shadertoy.com/view/MlyGzW

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

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

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    // circle in the center
    vec2 st = 2.1*(2.0*gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
    
    //vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;
    
    vec2 center = vec2(0., 0.);
    
    vec3 light_color = vec3(0.490,0.650,0.305);
    vec3 light_color2 = vec3(0.013,0.265,0.650);
    vec3 light_color3 = vec3(0.650,0.507,0.343);
	  float light = 0.2 / distance(normalize(st), st);
    vec3 color = light_color*light;
    
    color = mix(vec3(0.), color, 
                smoothstep(1.1+noise(st*0.7 + u_time*0.2)*0.1, 1.15+noise(st*0.7 + u_time*0.2)*0.1, distance(vec2(center.x, center.y), st))
               );
    
    color = mix(color, light_color2 * light * 200. * pow(distance(center, st),10.), 1. - 
      smoothstep(0.6+noise(st*0.8 + u_time*0.1)*0.3, 0.65+noise(st*0.8 + u_time*0.1)*0.3,distance(center, st))
    );
    
    color = mix(color, light_color3 * light * 100. * pow(distance(center, st),3.), 1. - 
    smoothstep(0.3+noise(st*0.4 + u_time*0.3)*0.2, 0.35+noise(st*0.4 + u_time*0.3)*0.2,distance(center, st))
    );

        
    gl_FragColor = vec4(color,1.0);
}


`;