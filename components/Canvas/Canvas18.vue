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

import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = true;
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
  renderer.setClearColor(appColors.white);

  const index = [];
  let idxInc = 0; // index increment

  const colors = [];
  const lines = [];

  // noise
  const aOff = 0.01;
  const bOff = 0.01;

  let aInc = 0; 
  let bInc = 0;
  let noiseVal;

  // noiseZ
  const aZOff = 0.002;
  const bZOff = 0.01;

  let aZInc = 0; 
  let bZInc = 0;
  let noiseValZ;

  const lineNumber = 50 + 50*Math.random();
  const detail = 800; // number of points for a line
  const detailFactor = 0.8 / 4; // x spread between each point
  const lineSpacing = 2;
  const spread = 1 + Math.random()*4;
  let spreadInc = spread; 

  let geometryH;
  let line;
  
  for ( let i = -lineNumber/2; i < lineNumber/2; i ++ ) {
    spreadInc -= spread/lineNumber;
    const curvePoints = [];
    for ( let j = -detail/2; j < detail/2; j++) {
      aInc += aOff;
      bInc += bOff;
      noiseVal = noise.noise(aInc, bInc);
      curvePoints.push(
        new THREE.Vector3(
          j * detailFactor,  // x
          noiseVal * spreadInc * (THREE.MathUtils.mapLinear(j, -detail/2, detail/2, 0, spreadInc)) + (i * lineSpacing), // y
          0
        )
      );
      colors.push(0, 0, 0);
      index.push(idxInc, idxInc+1);
      idxInc++;
    } 
    const curve = new THREE.SplineCurve(curvePoints);
    const points = curve.getPoints( detail );
    colors.push(0, 0, 0);
    idxInc++;
    // noise Z
    aZInc = 0;
    bZInc = 0;
    points.forEach((p, idx) => {
      console.log(idx);
      aZInc += aZOff;
      bZInc += bZOff;
      noiseValZ = noise.noise(aZInc, bZInc);
      p.z = noiseValZ;
      return p;
    });

    lines.push(points);
  }  

  const material = new THREE.LineBasicMaterial( { 
    vertexColors: true 
  } );
  geometryH = new THREE.BufferGeometry().setFromPoints( lines.flat() );
  geometryH.setIndex(index);
  geometryH.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  line = new THREE.LineSegments( geometryH, material );

  // duplicating 
  const geometryV = new THREE.BufferGeometry();
  geometryV.copy(geometryH);
  const line2 = new THREE.LineSegments( geometryV, material );

  line2.rotation.z = -Math.PI/2;
  line2.rotation.y = -Math.PI;
  line2.position.y -= lineSpacing/2;
  line2.position.x -= lineSpacing/2;

  /* PERFECT GRID with 3 vertices per LINE | WORKING WITH INDICES */
  /*
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial( { vertexColors: true } );
  let index = [];
  let idxInc = 0;

  for ( let i = -lineNumber/2; i < lineNumber/2; i ++ ) {

    const x1 = -30;
    const y1 = i*2;
    const x2 = 0;
    const y2 = i*2;
    const x3 = 30;
    const y3 = i*2;
    const z = 0;

    // positions
    positions.push( x1, y1, z );
    positions.push( x2, y2, z );
    positions.push( x3, y3, z );

    // colors
    colors.push(0.4, 0, 0);
    colors.push(0.4, 0, 0);
    colors.push(0.4, 0, 0);

    // every shared vertices shares the same index
    index.push(idxInc, idxInc+1, idxInc+1, idxInc+2);
    idxInc += 3;
  }
  
  geometry.setIndex(index);
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  const line = new THREE.LineSegments( geometry, material );
  */

  scene.add( line );
  scene.add( line2 );

  camera.position.set(0,0,100);
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

  dev ? console.log(renderer.info) : undefined ;
})
</script>