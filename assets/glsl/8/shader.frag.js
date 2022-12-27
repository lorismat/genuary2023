export default /* glsl */`

// created with thebookofshaders editor
// commented are the lines used within the editor

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;
varying vec3 vNormal;
varying vec3 pos;
varying vec3 pos2;

float line(vec2 st, float thickness, float posY) {
    float l = step(posY, st.y) - step(posY+thickness, st.y);
    return l;
}

void main () {

  vec2 st = vUv;
  float intensity = pow( 1.1 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.5 ); 
  vec3 color = vec3(1.);

  color += line(st, 0.002, floor(st.y*100.)/100. );
  color = mix(vec3(0.), color*intensity, step(3., distance(vNormal, pos2)));

  
  gl_FragColor =  vec4(color, 1.);
  
}
`;