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

import vertexShader from '@/assets/glsl/23/shader.vert';
import fragmentShader from '@/assets/glsl/23/shader.frag';

import vertexShader2 from '@/assets/glsl/23/shader2.vert';
import fragmentShader2 from '@/assets/glsl/23/shader2.frag';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 0.5;
const deltaStop = 1500;
const frameRate = 30;

let stats;

let canvas, scene, renderer, camera;
// extras
let mesh, mesh2;

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
  renderer.setClearColor("#fff");

  // shaders setup
  const uniforms = {
    u_time: { value: 0 },
    u_seed: { value: Math.random() }
  }
  
  const geometry = new THREE.SphereGeometry(1,64,64);
	const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent:true,
    uniforms: uniforms
  })

  mesh = new THREE.Mesh( geometry, material );
  
  
  const geometry2 = new THREE.SphereGeometry(5,64,64);
	const material2 = new THREE.ShaderMaterial({
    vertexShader: vertexShader2,
    fragmentShader: fragmentShader2,
    side: THREE.DoubleSide,
    transparent:true,
    uniforms: uniforms
  })

  mesh2 = new THREE.Mesh( geometry2, material2 );

  scene.add( mesh );
  scene.add( mesh2 );
  

  camera.position.set(0,0,15);
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

  // rendering actions
  
  mesh.material.uniforms.u_time.value = time;
  mesh2.material.uniforms.u_time.value = time;

  mesh.rotation.x += 0.01;
  mesh.rotation.z += 0.01;
  mesh.rotation.y += 0.01;

  mesh2.rotation.x += 0.01;
  mesh2.rotation.z += 0.01;
  mesh2.rotation.y += 0.01;
  
  
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