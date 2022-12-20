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

import vertexShader from '@/assets/glsl/29/shader.vert';
import fragmentShader from '@/assets/glsl/29/shader.frag';

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
// extras
let mesh;

const noise = new SimplexNoise();

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
  renderer.setClearColor(new THREE.Color(`hsl(${Math.random()*360}, 50%, 50%)`));

  // shaders setup
  const uniforms = {
    u_time: { value: 0 },
  }

  const geometry = new THREE.IcosahedronGeometry( 30, 15);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: uniforms
  });

  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const matrix = new THREE.Matrix4();

  const count = 150;
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
    position.x = noiseVal * 200;
    position.y = Math.random() * 300 - 150;
    position.z =  Math.random() * 300 - 150;

    quaternion.setFromEuler( rotation );
    scale.x = scale.y = scale.z = Math.random() * 1;
    matrix.compose( position, quaternion, scale );

    mesh.setMatrixAt( i, matrix );
  }

  scene.add( mesh );
  // mesh.lookAt(scene.position);
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

  const time = - performance.now() * 0.0005;
  renderer.render(scene, camera);

  // mesh.rotation.y += 0.01;
  // mesh.rotation.x += 0.01;
  // mesh.rotation.z += 0.01;
  stats.update();

  // rendering actions
  mesh.material.uniforms.u_time.value = time;
  
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