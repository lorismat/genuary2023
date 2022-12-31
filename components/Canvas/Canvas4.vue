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

import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

import vertexShader from '@/assets/glsl/4/shader.vert';
import fragmentShader from '@/assets/glsl/4/shader.frag';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 0.5;
const deltaStop = 2;
const frameRate = 1;

// app config
const appConfig = useAppConfig();
const colorPalette = appConfig.colors;

let stats;

let canvas, scene, renderer, camera;

// extras
let points;
const noise = new SimplexNoise();

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
  renderer.setClearColor(colorPalette.white);

  // points for the base lines / name is a bit confusing
  const particles = 5000;
  // thickness is the factor along the base lines
  const thickness = 40;
  // meaning: total points = particles * thickness

  // coeffs is the array of the a value for each line in: y = ax
  // length of coeffs is the number of base lines
  const coeffs = [0,0.1,0.5,0.3];

  // rangeX is the min and max value of x coordinates of the points
  const rangeX = [-200, 200];

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const sizes = [];

  // noise params
  // Off being the offset of the noise
  // Inc being the initial value, will be imcremented in a loop
  const aOff = 0.0001;
  const bOff = 0.0002;
  const aZOff = 0.001;
  const bZOff = 0.002;

  // seed of the initial Inc value
  let aInc = Math.random()*100;
  let bInc = Math.random()*100;
  let aZInc = Math.random()*100;
  let bZInc = Math.random()*100;

  let noiseValZ, noiseValSpread;

  // looping for points along the baseline
  for ( let i = 0; i < particles; i ++ ) {
    noiseValSpread = noise.noise(aInc, bInc) * 10;
    noiseValZ = noise.noise(aZInc, bZInc) * 50;
    // adding thickness to the baselines
    for ( let j = 0; j < thickness; j ++ ) {
      const idx = Math.trunc( ( ( i/particles ) * coeffs.length ) % coeffs.length ) // 0 - 1/5 - ... - 5/5;
      const x = j * 0.1 * noiseValSpread + THREE.MathUtils.mapLinear( i % ( particles / coeffs.length ), 0, particles / coeffs.length, rangeX[0], rangeX[1]);
      const y = j * 0.1 * noiseValSpread + coeffs[idx] * x;
      const z = noiseValZ;
      sizes.push(noiseValZ * 0.1 - 1);
      positions.push( x, y, z );
    }
    // affecting the thickness with noise
    aInc += aOff;
    bInc += bOff;

    // Z value to add depth, also affected by a noise
    aZInc += aZOff;
    bZInc += bZOff;
  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );

  geometry.computeBoundingSphere();

  // shader to define the size of each point based on their z value
  const material = new THREE.ShaderMaterial( {
    uniforms: {
      color: { value: new THREE.Color(colorPalette.black) },
    },
    vertexShader,
    fragmentShader
  } );

  points = new THREE.Points( geometry, material );
  scene.add( points );

  camera.position.set(0,-60,60);
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

  const time = - performance.now() * 0.0005;
  renderer.render(scene, camera);
  stats.update();
  
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