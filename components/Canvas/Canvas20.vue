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

import vertexShader from '@/assets/glsl/20/shader.vert';
import fragmentShader from '@/assets/glsl/20/shader.frag';

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

// app config
const appConfig = useAppConfig();
const appColors = appConfig.colors;

let stats;

let canvas, scene, renderer, camera;

let mesh;

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
  renderer.setClearColor(appColors.black);

  const geometry = new THREE.BoxGeometry( 30,30,200);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader
  });

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const matrix = new THREE.Matrix4();

  const count = 100;
	mesh = new THREE.InstancedMesh( geometry, material, count );

  const aOff = 0.5;
  const bOff = 0.5;
  let aInc = 100;
  let bInc = 100;

  let noiseVal;

  for(let i = 0;i<count;i++) {

    aInc += aOff;
    bInc += bOff;
    noiseVal = noise.noise(aInc, bInc);
    position.x = noiseVal * 20;
    position.y = Math.random() * 600 - 300;

    quaternion.setFromEuler( rotation );
    scale.x = scale.y = scale.z = Math.random() * 1 + 1;
    matrix.compose( position, quaternion, scale );

    mesh.setMatrixAt( i, matrix );
  }

  scene.add( mesh );

  const mesh2 = mesh.clone();
  scene.add(mesh2);

  mesh.position.x -= 100;
  mesh2.position.x += 100;

  mesh.position.y -= 0;
  mesh2.position.y += 0;

  mesh2.rotation.y = Math.PI;

  camera.position.set(0,0,430);
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