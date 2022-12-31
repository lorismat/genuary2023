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

import vertexShader from '@/assets/glsl/25/shader.vert';
import fragmentShader from '@/assets/glsl/25/shader.frag';

import vertexShaderBg from '@/assets/glsl/25/shader-bg.vert';
import fragmentShaderBg from '@/assets/glsl/25/shader-bg.frag';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 0.5;
const deltaStop = 100;
const frameRate = 1;

// app config
const appConfig = useAppConfig();
const appColors = appConfig.colors;

let stats;

let canvas, scene, renderer, camera;

let mesh, meshBg;

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

  const seedColor = new THREE.Color(`hsl(${Math.random()*360}, 90%, 50%)`);

  // shader sphere
  const uniforms = {
    u_time: { value: 0 },
    _color: { value: seedColor }
  }

  const geometry = new THREE.SphereGeometry( 5, 64*2 );
	const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms, 
    transparent:true
  })
  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  // shader bg
  const uniformsBg = {
    u_time: { value: 0 },
    _color: { value: seedColor }
  }
  const geometryBg = new THREE.PlaneGeometry(50 ,50, 100, 100);
	const materialBg = new THREE.ShaderMaterial({
    vertexShader: vertexShaderBg,
    fragmentShader: fragmentShaderBg,
    uniforms: uniformsBg
  })
  meshBg = new THREE.Mesh( geometryBg, materialBg );
  scene.add( meshBg );

  camera.position.set(0,0,16);
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
  meshBg.material.uniforms.u_time.value = time;
  
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