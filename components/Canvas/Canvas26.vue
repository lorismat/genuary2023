<template>
  <canvas 
    :style="resizeSmall.style"
    id="canvas"
  >
  </canvas>
</template>

<script setup>


// to do
// line for plane
// plane follows line
// random line for plane
// random spheres
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// dev vs prod, displaying stats/controls/recording accordingly
const dev = false;
const capture = false;

// record purposes
let capturer;
let recordingStop = 0;
let clock;
let delta = 0;
const deltaStep = 1;
const deltaStop = 1500;
const frameRate = 30;

// app config
const appConfig = useAppConfig();
const appColors = appConfig.colors;

let stats;

let canvas, scene, renderer, camera;

// extras
let meshPlane;
// for trajectory
let meshSpline, geometrySpline;
// instanced mesh for sphere
let meshSphere;

const direction = new THREE.Vector3();
const binormal = new THREE.Vector3();
const normal = new THREE.Vector3();
const position = new THREE.Vector3();
const lookAt = new THREE.Vector3();
const scalar = 1;

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
  camera = new THREE.OrthographicCamera( resizeSmall._value.width / - 2, resizeSmall._value.width / 2, resizeSmall._value.height / 2, resizeSmall._value.height / - 2, 1, 1000 );

  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(resizeSmall._value.width, resizeSmall._value.height);
  renderer.setClearColor( 
    new THREE.Color(`hsl(${Math.random()*360}, 99%, 97%)`)
  );
  
  camera.position.set(0,0,600);
  camera.lookAt( scene.position );

  const loader = new GLTFLoader();
  const planeSize = 2;

  // import
  loader.load(
    "models/plane.glb",
    function ( gltf ) {
      meshPlane = gltf.scene.getObjectByName( 'Plane' );
      meshPlane.material = new THREE.MeshToonMaterial({
        color: new THREE.Color(`hsl(${Math.random()*360}, 80%, 30%)`),
        side: THREE.DoubleSide
      });
      meshPlane.scale.set( planeSize, planeSize, planeSize );
      scene.add( meshPlane );
      meshPlane.geometry.rotateZ(Math.PI);
    },
  );


  // path for camera
  const scalarSpline = 250;
  const pointsForSpline = [];
  const numberPoints = Math.random()*15 + 5;

  for (let i = 0; i<numberPoints; i++) {
    pointsForSpline.push(new THREE.Vector3((Math.random() * 3 - 1.5) * scalarSpline , (Math.random() * 3 - 1.5) * scalarSpline, (Math.random() * 3 - 1.5) * scalarSpline ))
  }
  const sampleClosedSpline = new THREE.CatmullRomCurve3(pointsForSpline);

  sampleClosedSpline.curveType = 'catmullrom';
	sampleClosedSpline.closed = true;

  const materialSpline = new THREE.MeshToonMaterial({
    transparent: true,
    opacity : 0.7,
    color: new THREE.Color(`hsl(${Math.random()*360}, 70%, 30%)`)
  });

  geometrySpline = new THREE.TubeGeometry( sampleClosedSpline, 3000, 2, 8, true );

  meshSpline = new THREE.Mesh( geometrySpline, materialSpline );
  meshSpline.scale.set( scalar, scalar, scalar );
  scene.add(meshSpline);

  // mesh sphere instanced

  const matrix = new THREE.Matrix4();
  const amountSpheres = 60;

  const geometrySphere = new THREE.IcosahedronGeometry( 1, 8 );


  const materialSphere = new THREE.MeshToonMaterial({
    color: 0xffffff
    // color: new THREE.Color("#fff"),
  });
  meshSphere = new THREE.InstancedMesh( geometrySphere, materialSphere, amountSpheres )
  
  for ( let i = 0; i < amountSpheres; i ++ ) {

    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    position.x = Math.random() * 600 - 300;
    position.y = Math.random() * 600 - 300;
    position.z = Math.random() * 600 - 300;

    scale.x = scale.y = scale.z = Math.random() * 20 + 10;

    rotation.x = 0;
    rotation.y = 0;
    rotation.z = 0;
    quaternion.setFromEuler( rotation );

		matrix.compose( position, quaternion, scale );

    const color = new THREE.Color(`hsl(${Math.random()*360}, 70%, 30%)`);
    
    meshSphere.setMatrixAt( i, matrix );
    meshSphere.setColorAt( i, color );
  }
  console.log(meshSphere);
  scene.add( meshSphere );

  const light = new THREE.PointLight( 0xffffff, 1);
  light.position.set( -20, 20, -20 );
  scene.add( light );
  scene.add(new THREE.AmbientLight(0xffffff))

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

  const time = Date.now();
  renderer.render(scene, camera);

  // Object follows a path via linear interpolation
  // directly from official three.js example
  // https://threejs.org/examples/?q=spline#webgl_geometry_extrude_splines

  const looptime = 30 * 1000;
  const t = ( time % looptime ) / looptime;

  geometrySpline.parameters.path.getPointAt( t, position );
	position.multiplyScalar( scalar );

  const segments = geometrySpline.tangents.length;
  const pickt = t * segments;
  const pick = Math.floor( pickt );
  const pickNext = ( pick + 1 ) % segments;

  binormal.subVectors( geometrySpline.binormals[ pickNext ], geometrySpline.binormals[ pick ] );
  binormal.multiplyScalar( pickt - pick ).add( geometrySpline.binormals[ pick ] );
  geometrySpline.parameters.path.getTangentAt( t, direction );
  const offset = -5;

  normal.copy( binormal ).cross( direction );
  position.add( normal.clone().multiplyScalar( offset ) );
  

  // using arclength for stablization in look ahead
  geometrySpline.parameters.path.getPointAt( ( t + 30 / geometrySpline.parameters.path.getLength() ) % 1, lookAt );
  lookAt.multiplyScalar( scalar );
  lookAt.copy( position ).add( direction );

  if (meshPlane != undefined) {
    meshPlane.position.copy( position );
    meshPlane.matrix.lookAt( meshPlane.position, lookAt, normal );
    meshPlane.quaternion.setFromRotationMatrix( meshPlane.matrix );
  } 
  


  stats.update();
  
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

<style lang="scss">
button {
  background-color: transparent !important;
}
</style>