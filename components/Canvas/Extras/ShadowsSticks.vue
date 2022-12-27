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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import vertexShader from '@/assets/glsl/22/shader.vert';
import fragmentShader from '@/assets/glsl/22/shader.frag';

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

let canvas, scene, renderer, camera, composer;
// extras
let monoMesh;
let monoGeometry;
let monoMaterial;
const dummy = new THREE.Object3D();

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

  const colorBackground = new THREE.Color(`hsl(${Math.random()*360}, 50%, 50%)`);
  const colorLight = new THREE.Color(`hsl(${Math.random()*360}, 90%, 60%)`);

  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(resizeSmall._value.width, resizeSmall._value.height);
  renderer.setClearColor(colorBackground);
  renderer.shadowMap.enabled = true;

  const loader = new GLTFLoader();
  const count = 100;

  // import
  loader.load(
    "models/monolit.glb",
    function ( gltf ) {
      const _monoMesh = gltf.scene.getObjectByName( 'Cylinder' );
      monoGeometry = _monoMesh.geometry.clone();

      const defaultTransform = new THREE.Matrix4()
        .makeRotationX( Math.PI )
        .multiply( new THREE.Matrix4().makeScale( 1, 70, 1 ) );
      monoGeometry.applyMatrix4( defaultTransform );

      monoMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
      });
      

      monoMesh = new THREE.InstancedMesh( monoGeometry, monoMaterial, count );

      monoMesh.castShadow = true;
      monoMesh.receiveShadow = true;
      scene.add( monoMesh );

      for (let i = 0; i<count; i++) {
        dummy.position.set( -count/2 + i, 50 + Math.random() * count - count/2, Math.random() * 100 - count/2  );
			  dummy.updateMatrix();
			  monoMesh.setMatrixAt( i, dummy.matrix );
      }
      
    },
  );

  camera.position.set(0,190,0);
  camera.lookAt( new THREE.Vector3(0, 0, 0) );

  // Lights
  // scene.add(new THREE.AmbientLight( new THREE.Color("#cc6b03") ));
  
  const pointLight = new THREE.PointLight(colorLight, 1.1);
  pointLight.castShadow = true;
  pointLight.position.set(20,0,0)
  scene.add(pointLight);

  composer = new EffectComposer( renderer );
  composer.addPass( new RenderPass( scene, camera ) );

  const ShaderEffect = {
		uniforms: {
      'tDiffuse': {
				value: null
			},
      /*
			'amount': {
				value: 0.005
			},
			'angle': {
				value: 0.0
			}
      */
    },
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	};

  const effect = new ShaderPass( ShaderEffect );
  composer.addPass( effect );

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

  // const time = - performance.now() * 0.0005;
  // renderer.render(scene, camera);
  composer.render();
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