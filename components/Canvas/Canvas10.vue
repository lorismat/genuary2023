<template>
  <div>
    <canvas 
      :style="resizeSmall.style"
      id="canvas"
    >
    </canvas>
    <button id="play">PLAY MUSIC</button>
  </div>
</template>

<script setup>
import * as Tone from 'tone';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import vertexShader from '@/assets/glsl/10/shader.vert';
import fragmentShader from '@/assets/glsl/10/shader.frag';

// sound
let soundStart, player, analyser, soundData;

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 0.5;
const deltaStop = 300;
const frameRate = 1;

let stats;

let canvas, scene, renderer, camera;

// extras
let mesh;
let inc = 0;

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
    freq1: { value: 0},
    freq2: { value: 0},
    freq3: { value: 0},
  }
  
  const geometry = new THREE.SphereGeometry(10,64*2, 64*2);
	const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms,
    transparent:true
  })

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  const clone = mesh.clone();
  clone.scale.set(0.95,0.95,0.95);

  clone.material = new THREE.MeshNormalMaterial();
  //scene.add(clone);

  camera.position.set(0,0,30);
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

  inc++;

  // rendering actions
  if (soundStart) {
    mesh.material.uniforms.u_time.value = time;
    mesh.material.uniforms.freq1.value = soundData.getValue()[4];
    mesh.material.uniforms.freq2.value = soundData.getValue()[8];
    mesh.material.uniforms.freq3.value = soundData.getValue()[12];
  }
  
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

  // sound
  //attach a click listener to a play button
  document.getElementById("play")?.addEventListener('click', async () => {
    document.getElementById("play").style.display = "none";
    await Tone.start();
    player = new Tone.Player("/sound/sunder.mp3").toDestination();
    analyser = new Tone.Analyser("waveform", 16);
    player.connect(analyser);
    player.volume.value = -6;
    player.autostart = true;
    soundStart = true;
    soundData = analyser;
  })
})

onBeforeUnmount(() => {
  player.stop();
  player.dispose()
});
</script>

<style lang="scss" scoped>
#play {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid #fff;
  font-size: 1rem;
  padding: 8px 16px;
}

</style>