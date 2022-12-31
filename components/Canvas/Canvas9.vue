<template>
  <div>
    <canvas 
        :style="resizeSmall.style"
        id="canvas"
      >
    </canvas>
    <br>
    <div id="not-responsive"></div>
  </div>
  
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import vertexShader from '@/assets/glsl/9/shader.vert';
import fragmentShader from '@/assets/glsl/9/shader.frag';

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
let points; 
let lerpVal, posToLerp;

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

  /* FLOWERS MAIN */

  // shaders setup
  const uniforms = {
    u_time: { value: 0 },
    color: { value: new THREE.Color( 0xffffff ) }
  }

  const geometry = new THREE.BufferGeometry();
	const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms
  })

  const flowerNumber = 200;
  let minParticlesOnFlower = 500;
  let maxExtraParticlesOnFlower = 2000;

  const positions = [];
  const sizes = [];
  const colors = [];

  // flower base spread
  const nX = 1000, nX2 = nX / 2; 
  const nY = 300, nY2 = nY / 2; 
  const nZ = 300, nZ2 = nZ / 2; 

  // palette
  const palette = [
    [96, 255, 33],
    [53, 179, 3],
    [78, 255, 7],
    [69, 148, 81],
    [159, 219, 67],
    [196, 255, 110],
  ]

  palette.map(c => {
    c[0] /= 255;
    c[1] /= 255;
    c[2] /= 255; 
  })


  const flowers = Array(flowerNumber).fill().map((_, i) => {
    const flower = {
      // one color among palette colors
      "mainColor": palette[Math.trunc(Math.random() * palette.length)],
      "centerX": Math.random() * nX - nX2,
      "centerY": Math.random() * nY - nY2,
      "centerZ": Math.random() * nZ - nZ2,
      "sizeCenter": 2,
      "particles": Math.round(Math.random() * maxExtraParticlesOnFlower + minParticlesOnFlower),
      "radiusMax": Math.random() * 30 + 10,
      "radiusMin": 10
    }
    return flower
  })

  for ( let i = 0; i < flowers.length; i ++ ) {

    positions.push( flowers[i].centerX, flowers[i].centerY, flowers[i].centerZ );
    sizes.push(flowers[i].sizeCenter);

    const color = new THREE.Color(0xffffff);
    color.setRGB(flowers[i].mainColor[0],flowers[i].mainColor[1],flowers[i].mainColor[2] );
    colors.push(color.r, color.g, color.b);

    for ( let j = 0; j<flowers[i].particles; j++) {
      // radius max for all the particle of the same flower
      const r = flowers[i].radiusMin +  Math.random()*20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;

      // spherical coordinates
      const x = flowers[i].centerX + r * Math.sin(theta) * Math.cos(phi);
      const y = flowers[i].centerY + r * Math.sin(theta) * Math.sin(phi);
      const z = flowers[i].centerZ + r * Math.cos(theta);

      const color = new THREE.Color(0xffffff);
      color.setRGB(flowers[i].mainColor[0],flowers[i].mainColor[1],flowers[i].mainColor[2] );
      colors.push(color.r, color.g, color.b);

      positions.push( x, y, z );

      sizes.push(Math.random()*3);
      
    }

  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  points = new THREE.Points( geometry, material );
  scene.add( points );

  /* STEM */
  const stemHeight = 500;
  const thickness = 0.1;
  const geometryStem = new THREE.CylinderGeometry( thickness, thickness, stemHeight, 32 );
  const materialStem = new THREE.MeshBasicMaterial();

  const mesh = new THREE.InstancedMesh( geometryStem, materialStem, flowers.length );
  const matrix = new THREE.Matrix4();

  for ( let i = 0; i < flowers.length / 10; i ++ ) {
    matrix.setPosition( 
      flowers[i].centerX, 
      flowers[i].centerY - stemHeight/2, 
      flowers[i].centerZ
    );
    mesh.setMatrixAt( i, matrix );

    const color = new THREE.Color(0xffffff);
    color.setRGB(flowers[i].mainColor[0],flowers[i].mainColor[1],flowers[i].mainColor[2] );
    mesh.setColorAt( i, color)
  }
  scene.add( mesh );

  // 2 random positions for camera moves
  const posInit = flowers[Math.round(Math.random()*flowerNumber)];
  const posEnd = flowers[Math.round(Math.random()*flowerNumber)];

  camera.position.set(posInit.centerX, posInit.centerY, posInit.centerZ);
  posToLerp = new THREE.Vector3(posEnd.centerX, posEnd.centerY, posEnd.centerZ);
  camera.lookAt( scene.position );

  lerpVal = 0;

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

  lerpVal += 0.000005;

  camera.position.lerp(posToLerp, lerpVal);
  camera.lookAt( scene.position );
  
  // RECORDING CYCLE
  if (dev && capture) {
    delta += deltaStep;
    if (recordingStop < 1) {
      recordingStop = compRecordCapture(capturer, canvas, recordingStop, delta, deltaStop);
    } 
  }
}

onMounted(() => {

  if (window.innerWidth > 700) {
    init();
    animate();
  } else {
    const messageId = document.getElementById('not-responsive');
    messageId.innerHTML = "Unfortunately, not suitable for mobile devices";
  }

  window.addEventListener("resize", function() {
    compOnWindowResize(camera, renderer, window);
  });
  const randBtn = document.getElementById('randomize');

  if (window.innerWidth > 700) {
    if (randBtn != undefined) {
      randBtn.onclick = function() { 
        init();
      };
    }
  }
})
</script>