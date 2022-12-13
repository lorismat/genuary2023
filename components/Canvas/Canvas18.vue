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
const deltaStop = 2;
const frameRate = 1;

// app config
const appConfig = useAppConfig();
const appColors = appConfig.colors;

let stats;
let canvas, scene, renderer, camera;

const noise = new SimplexNoise();
// noise
const aOff = 0.01;
const bOff = 0.01;
const zOff = 0.01;

let aInc = 0; 
let bInc = 0;
let zInc = 0;
let noiseVal;

const lineNumber = 80;
const detail = 50; // number of points for a line
const detailFactor = 2; // x spread between each point
const lineSpacing = 2;
const spread = 4;
let spreadInc = spread; 

let geometryH;
let line;


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

  /* DRAFT SPLINE

  for ( let i = -lineNumber/2; i < lineNumber/2; i ++ ) {

    const curve = new THREE.SplineCurve( [
      new THREE.Vector2( Math.random() * 10, Math.random() * 10),
      new THREE.Vector2( Math.random() * 10, Math.random() * 10 ),
      new THREE.Vector2(Math.random() * 10 , Math.random() * 10  ),
      new THREE.Vector2(Math.random() * 10 , Math.random() * 10  ),
      new THREE.Vector2( Math.random() * 10, Math.random() * 10 )
    ] );

    colors.push(0.4, 0, 0);
    // indices.push(0);

    const points = curve.getPoints( detail );

    console.log(points);

    indices.push(idx);
    //idx++;

    for (let j = 0; j<detail; j++) {
      colors.push(0.4, 0, 0);
      indices.push(idx);
      idx++;
    } 

    lines.push(points.flat());
    // idx++;
  }

  console.log(indices, lines.flat().length, colors, indices)

  const geometry = new THREE.BufferGeometry().setFromPoints( lines.flat() );

  console.log(geometry)
  geometry.setIndex( indices );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  const material = new THREE.LineBasicMaterial( { vertexColors: true } );
  // Create the final object to add to the scene
  const line = new THREE.LineSegments( geometry, material );
  */

  const index = [];
  let idxInc = 0; // index increment
  const colors = [];
  const noises = [];
  const lines = [];
  
  for ( let i = -lineNumber/2; i < lineNumber/2; i ++ ) {
    spreadInc -= spread/lineNumber;
    const curvePoints = [];
    for ( let j = -detail/2; j < detail/2; j++) {
      aInc += aOff;
      bInc += bOff;
      
      noiseVal = noise.noise3d(aInc, bInc, zInc);
      curvePoints.push(
        new THREE.Vector2(
          j * detailFactor, spread, noiseVal * spreadInc * (THREE.MathUtils.mapLinear(j, -detail/2, detail/2, 0, spreadInc)) + (i * lineSpacing)
        )
      );
      colors.push(1, 0, 0);
      noises.push(aInc,bInc, zInc);

      index.push(idxInc, idxInc+1);
      idxInc++;
    } 
    const curve = new THREE.SplineCurve(curvePoints);
    const points = curve.getPoints( detail );
    colors.push(1, 0, 0);
    noises.push(aInc,bInc, zInc);
    idxInc++;
    lines.push(points);
  }  

  const material = new THREE.LineBasicMaterial( { vertexColors: true } );
  geometryH = new THREE.BufferGeometry().setFromPoints( lines.flat() );
  
  geometryH.setIndex(index);
  geometryH.setAttribute( 'noises', new THREE.Float32BufferAttribute( noises, 3 ) );
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

  /* PERFECT GRID with 3 vertices per LINE | WORKING WITH INDEXEs */
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
  //scene.add(line2);

  camera.position.set(0,0,50);
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

  //console.log(line);
}

function animate() {
  requestAnimationFrame(animate);

  const time = - performance.now() * 0.0005;
  renderer.render(scene, camera);
  stats.update();


  /*
  const lines = [];

  const spread = 1;
  let spreadInc = spread; 
  let inc = 0;

  for ( let i = -lineNumber/2; i < lineNumber/2; i ++ ) {
    spreadInc -= spread/lineNumber;
    const curvePoints = [];
    for ( let j = -detail/2; j < detail/2; j++) {
      aInc += aOff;
      bInc += bOff;
      noiseVal = noise.noise(aInc, bInc);
      curvePoints.push(
        new THREE.Vector2(
          j / 10, line.geometry.attributes.position.array[inc*3+1]
          // noiseVal * spreadInc * (THREE.MathUtils.mapLinear(j, -detail/2, detail/2, 0, spreadInc)) + (i * lineSpacing)
        )
      );
      inc++;
    } 
    const curve = new THREE.SplineCurve(curvePoints);
    const points = curve.getPoints( detail );

    lines.push(points);
    inc++;
  }  

  geometryH.setFromPoints( lines.flat() );

  */



  let inc = 0;
  spreadInc = spread;

  zInc = time / 5;
  
  // get line 
  for (let i = 0; i < lineNumber; i++) {
    spreadInc -= spread/lineNumber;
    for (let j = 0; j < detail; j++) {
      noiseVal = noise.noise3d(
        line.geometry.attributes.noises.array[inc*3], 
        line.geometry.attributes.noises.array[inc*3+1], 
        zInc
      );
      ;
      line.geometry.attributes.position.array[inc*3+1] = noiseVal * spreadInc * (THREE.MathUtils.mapLinear(j, -detail/2, detail/2, 0, spreadInc)) + (i * lineSpacing);
      inc ++;
    }
    inc ++;
  }
    // get point


  line.geometry.attributes.position.needsUpdate = true;  
  
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