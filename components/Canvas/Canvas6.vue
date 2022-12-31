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
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import vertexShader from '@/assets/glsl/6/shader.vert';
import fragmentShader from '@/assets/glsl/6/shader.frag';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 0.5;
const deltaStop = 200;
const frameRate = 1;

let stats;

let canvas, scene, renderer, camera;
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

  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(resizeSmall._value.width, resizeSmall._value.height);
  renderer.setClearColor("#000");

  // shaders setup
  const uniforms = {
    u_time: { value: 0 },
  }
  // instancing cube
	const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms,
    side: THREE.DoubleSide
  })

  // svg loader
  const url = '/svg/cenizas.svg';
  const loader = new SVGLoader();
  loader.load( url, function ( data ) {
    const paths = data.paths;
    for ( let i = 0; i < paths.length; i ++ ) {
      const path = paths[ i ];
      for ( let j = 0, jl = path.subPaths.length; j < jl; j ++ ) {
        const subPath = path.subPaths[ j ];
        const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );
        if ( geometry ) {
          mesh = new THREE.Mesh( geometry, material );
        }
      }
    }
    scene.add( mesh );
    mesh.position.x = -250;
    mesh.position.y = 250;

    mesh.rotation.z = Math.PI;
    mesh.rotation.y = Math.PI;
  })
  
  camera.position.set(0,0,500);
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

  mesh != undefined ? mesh.material.uniforms.u_time.value = time: '';

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