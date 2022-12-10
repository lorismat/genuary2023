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
let capturer, clock;
let recordingStop = 0;
const capture = false;

let canvas, scene, renderer, camera, cube;
let materialCube;

// dev vs prod, displaying stats accordingly
const dev = true;

// wheter the canvas should be 500x500 or fullWidth/fullHeight
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

  renderer.setClearColor(colors.white);

  const geometryCube = new THREE.BoxGeometry(1,1,1);

  materialCube = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
    }
  })

  cube = new THREE.Mesh(geometryCube, materialCube);
  scene.add(cube);

  camera.position.set(0,0,5);
  camera.lookAt( scene.position );

  const controls = new OrbitControls( camera, renderer.domElement );

  stats = new Stats();
  if (dev) {
    const domContainer = document.body.appendChild( stats.dom );
    domContainer.style.top = "";
    domContainer.style.bottom = "0";
  }

  // recording on mount
  if (dev && capture) {
    capturer = new CCapture({
      framerate: 30,
      name: `canvas-${Math.random().toFixed(3)}`,
      startTime: 1,
      motionBlurFrames: 1,
      format: props.record,
      workersPath: '/libs/'
    });
    capturer.start();
    clock = new THREE.Clock();
  }
  
}

function animate() {
  requestAnimationFrame(animate);

  const time = - performance.now() * 0.0005;
  materialCube.uniforms.time.value = time;

  renderer.render(scene, camera);
  stats.update();

  // recording on mount for a periodic cycle
  if (dev && capture) {
    if (recordingStop < 1) {
      const delta = clock.getElapsedTime();
      capturer.capture(canvas);
      // one cycle output goes from 0 to 2*PI
      if ( delta > 2*Math.PI ) {
        capturer.stop();
        capturer.save();
        recordingStop++;
      }
    }
  }

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight ;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onMounted(() => {
  window.addEventListener("resize", onWindowResize);
  init();
  animate();
})
</script>