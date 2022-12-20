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

import vertexShader from '@/assets/glsl/15/shader.vert';
import fragmentShader from '@/assets/glsl/15/shader.frag';

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
    10000
  );

  const instances = 300;
  const seedColor = new THREE.Vector3(Math.random(),Math.random(),Math.random());

  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(resizeSmall._value.width, resizeSmall._value.height);
  renderer.setClearColor(new THREE.Color(seedColor.x, seedColor.y, seedColor.z));

  // shaders setup
  const uniforms = {
    u_time: { value: 0 },
    seedColor: { value: seedColor }
  }

  // 

  const spread = 12 + Math.random() * 10;
  class CustomSinCurve extends THREE.Curve {
    constructor( scale = 10 ) {
      super();
      this.scale = scale;
    }
    getPoint( t, optionalTarget = new THREE.Vector3() ) {
      const tx = t * spread - spread/2;
      const ty = Math.sin( 2 * Math.PI * t );
      const tz = 0;
      return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
    }
  }

  const accuracy = 210;
  const path = new CustomSinCurve( 50 );
  const geometry = new THREE.TubeGeometry( path, accuracy, 10, 4, false );
  
	const material = new THREE.ShaderMaterial( { 
    vertexShader,
    fragmentShader,
    uniforms: uniforms,
    side: THREE.DoubleSide, 
    transparent: true
  } );

  mesh = new THREE.InstancedMesh( geometry, material, instances );
  const matrix = new THREE.Matrix4();

  for ( let i = 0; i < instances; i ++ ) {
    const position = new THREE.Vector3(
      0, 
      Math.random()*i*10, 
      -i*10
    );
    matrix.setPosition(position.x, position.y, position.z);
    mesh.setMatrixAt( i, matrix );
  }

  scene.add(mesh);

  camera.position.set(0,-250,500);
  camera.lookAt( new THREE.Vector3(0, 100, -500) );

  // STATS AND CONTROLS
  stats = new Stats();
  if (dev) {
    //const controls = new OrbitControls( camera, renderer.domElement );
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
  // mesh.material.uniforms.u_time.value = time;
  
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