<template>
  <canvas 
    :style="resizeSmall.style"
    id="canvas"
  >
  </canvas>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import vertexShader from '@/assets/glsl/28/shader.vert';
import fragmentShader from '@/assets/glsl/28/shader.frag';

import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 1;
const deltaStop = 1200;
const frameRate = 30;

let stats;

let canvas, scene, renderer, camera;
// extras
let points;
const noise = new SimplexNoise();
let inc;

// canvas sizes and record properties
const props = defineProps({
  small: String,
  record: String
})

// resizing canvas accordingly with the composable function compResize
const resizeSmall = computed(() => {
  return compResize(props.small);
})

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    resizeSmall._value.width / resizeSmall._value.height,
    1,
    3000
  );

  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(resizeSmall._value.width, resizeSmall._value.height);
  renderer.setClearColor(`hsl(${Math.random()*360}, 30%, 90%)`);

  inc = 0;

  // shaders setup
  const uniforms = {
    u_time: { value: 0 },
  }

  const particles = 30000;
  const geometry = new THREE.BufferGeometry();

  const positions = [];
  const positionsP = [];
  const positionsPP = [];
  const colors = [];
  const sizes = [];

  const n = 10;

  const arr = [];
  const arrL = 30;
  for (let i = 0; i<arrL; i++) {
    arr.push(i/arrL);
  }

  const xInc = 0.001;
  const yInc = 0.001;
  let xOffX = Math.random()*100.;
  let yOffX = Math.random()*100.;

  let xOffY = Math.random()*100.;
  let yOffY = Math.random()*100.;
  let noiseValX, noiseValY;

  for ( let i = 0; i < particles; i ++ ) {

    noiseValX = noise.noise(xOffX, yOffX);
    noiseValY = noise.noise(xOffY, yOffY);

    const x = THREE.MathUtils.mapLinear(noiseValX, 0, 1, 0, 10);
    const y = THREE.MathUtils.mapLinear(noiseValY, 0, 1, 0, 10);

    positions.push( x, y, 10);
    positionsPP.push( x, y, 20);

    xOffX += xInc;
    yOffX += yInc;

    xOffY += xInc;
    yOffY += yInc;
    
    // positions clusters
    const radiusP = 30;
    const thetaP = arr[Math.round(Math.random()*arrL)] * 2 * Math.PI;
    const phiP = Math.random() * 2 * Math.PI;

    const xP = radiusP * Math.cos(phiP) * Math.sin(thetaP);
    const yP = radiusP * Math.sin(phiP) * Math.sin(thetaP);
    const zP = radiusP * Math.cos(thetaP);

    positionsP.push( xP, yP, zP );
    colors.push( 0., 0., 0. );
    sizes.push(0.1);
  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
  geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ));
  geometry.setAttribute( 'positionP', new THREE.Float32BufferAttribute( positionsP, 3 ) );
  geometry.setAttribute( 'positionPP', new THREE.Float32BufferAttribute( positionsPP, 3 ) );

  const material = new THREE.ShaderMaterial( { 
    vertexShader, 
    fragmentShader,
    uniforms: uniforms,
  } );
  points = new THREE.Points( geometry, material );

  scene.add( points );

  camera.position.set(0,0,40);
  camera.lookAt( scene.position );

  // STATS AND CONTROLS
  stats = new Stats();
  if (dev) {
    const controls = new OrbitControls( camera, renderer.domElement );
    const domContainer = document.body.appendChild( stats.dom );
    domContainer.style.top = "";
    domContainer.style.bottom = "0";
  }

  // RECORDING SET UP
  if (dev && capture) {
    capturer = compInitCapture(capturer, props.record, clock, frameRate);
  }

}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  stats.update();

  inc+= 0.005;
  points.material.uniforms.u_time.value = inc;
  
  // RECORDING CYCLE
  if (dev && capture) {
    delta += deltaStep;
    if (recordingStop < 1) {
      recordingStop = compRecordCapture(capturer, canvas, recordingStop, delta, deltaStop);
    } 
  }
}

onMounted(() => {
  init();
  animate();
  window.addEventListener("resize", function() {
    compOnWindowResize(camera, renderer, window);
  });
  const randBtn = document.getElementById('randomize');
  if (randBtn != undefined) {
    randBtn.onclick = function() { 
      init();
    };
  }

})
</script>

<style lang="scss">
button {
  background-color: transparent !important;
}
</style>