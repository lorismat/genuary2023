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

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 0.5;
const deltaStop = 1;
const frameRate = 1;

let stats;

let canvas, scene, renderer, camera;
const noise = new SimplexNoise();

// extras
let mesh;

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

  const seedColor = Math.random();

  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(resizeSmall._value.width, resizeSmall._value.height);

  const bgColor = new THREE.Color(0xffffff)
  renderer.setClearColor(bgColor.setHSL( seedColor, 0.6, 0.15 ));

  
  const detail = 15;
  const geometry = new THREE.IcosahedronGeometry(10,detail);

  // noise
  const aOff = 0.01;
  const bOff = 0.01;

  let aInc = Math.random()*100; 
  let bInc = Math.random()*100;
  let noiseVal;

  const colors = [];
  let color = new THREE.Color("purple");
  
  const variationDetail = Math.round(Math.random()*20) + 2;

  for (let i=0;i<geometry.attributes.position.count; i++) {
    if (i % variationDetail == 0) {
      noiseVal = noise.noise(aInc, bInc);
      color.setHSL( seedColor + noiseVal/5, 0.99, 0.5 );
      aInc += aOff;
      bInc += bOff;
    }
    colors.push( color.r, color.g, color.b );
    geometry.attributes.position.array[i*3+2] = noiseVal*30;
  }
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

	const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    opacity:0.9,
    transparent:true
  })

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  camera.position.set(0,0,45);
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

  console.log(renderer.info);
})
</script>