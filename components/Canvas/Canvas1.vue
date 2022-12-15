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

import vertexShader from '@/assets/glsl/1/shader.vert';
import fragmentShader from '@/assets/glsl/1/shader.frag';

// app config
const appConfig = useAppConfig();
const colors = appConfig.colors;

let stats;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;

let canvas, scene, renderer, camera;
let mesh, matrix;

// objects on one row
const amount = 30;
const offset = ( amount - 1 ) / 2;
const count = Math.pow( amount, 2 );

// factor
const step = 0.002;

// amplitudes
const amplitudes = [];
const amplitudeMin = 50; // min amplitude
const amplitudeRandomness = 10; // extra amplitude: random from 0 to 10

// init Z positions are randomised
const incs = [];

// position attribute for vertex shader
const positions = [];

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// canvas sizes and record properties
const props = defineProps({
  small: Number,
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
  renderer.setClearColor(colors.white);

  // instancing cube
  const geometry = new THREE.BoxGeometry(1,1,1);
	const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    // transparent: true
  })

  mesh = new THREE.InstancedMesh( geometry, material, count );
  matrix = new THREE.Matrix4();

  // counter for the grid index
  let i = 0;
  for ( let x = 0; x < amount; x ++ ) {
    for ( let y = 0; y < amount; y ++ ) {
      // random increment used to map the z coordinates
      const inc = Math.random();
      // amplitude
      const a = amplitudeMin/2 + Math.random() * amplitudeRandomness;
      // define a custom amplitude for each cube
      amplitudes.push(a)
      // define a custom init position
      incs.push(inc);
      
      const position = new THREE.Vector3(
        offset - x, 
        offset - y, 
        THREE.MathUtils.mapLinear(
          inc, 
          0, 
          1, 
          a, -a
        )
      );

      matrix.setPosition(position.x, position.y, position.z);
      mesh.setMatrixAt( i, matrix );
      i ++;
    }
  }
  mesh.geometry.setAttribute( 'amplitude', new THREE.Float32BufferAttribute( amplitudes, 1 ) );
  mesh.geometry.setAttribute( 'inc', new THREE.Float32BufferAttribute( incs, 1 ) );


  scene.add( mesh );

  camera.position.set(0,0,10);
  camera.lookAt( scene.position );

  stats = new Stats();
  if (dev) {
    const controls = new OrbitControls( camera, renderer.domElement );
    const domContainer = document.body.appendChild( stats.dom );
    domContainer.style.top = "";
    domContainer.style.bottom = "0";
  }

  // RECORDING SET UP
  if (dev && capture) {
    capturer = compInitCapture(capturer, props.record, clock, 30);
  }
  
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  stats.update();

  delta += step;

  let i = 0;
  for ( let x = 0; x < amount; x ++ ) {
    for ( let y = 0; y < amount; y ++ ) {
      mesh.geometry.attributes.inc.array[i] += step;
      const position = new THREE.Vector3(
        offset - x, 
        offset - y, 
        THREE.MathUtils.mapLinear(
          mesh.geometry.attributes.inc.array[i] % 1, 
          0, 
          1, 
          mesh.geometry.attributes.amplitude.array[i], -mesh.geometry.attributes.amplitude.array[i]
        )
      );
      matrix.setPosition(position.x, position.y, position.z);
      mesh.setMatrixAt( i, matrix );
      i ++;
    } 
  }
  mesh.instanceMatrix.needsUpdate = true;

  // RECORDING CYCLE
  if (dev && capture) {
    if (recordingStop < 1) {
      recordingStop = compRecordCapture(capturer, canvas, recordingStop, delta, 1);
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