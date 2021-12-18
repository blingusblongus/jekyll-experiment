import './style.css';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AmbientLight, Group } from 'three';
import { throttle } from 'lodash-es';
import { CSS3DRenderer, CSS3DObject} from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let aspectRatio = window.innerWidth / window.innerHeight;

const scene = new THREE.Scene();
scene.background = null;
// const cssScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(68, aspectRatio, 0.1, 100);
const resizeUpdateInterval = 1000;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
  alpha: true
});



renderer.setClearColor( 0xffffff, .0);
scene.background = null;
// Make sure to always load from top of page
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

renderer.toneMappingExposure = Math.pow(1.1, 4.0 );

// const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), .9, .01, .3);
// bloomPass.material

// const composer = new EffectComposer(renderer);
// const renderPass = new RenderPass(scene, camera);
// // const cssPass = new RenderPass(cssScene, camera);
// composer.addPass(renderPass);
// composer.addPass(cssPass);
// composer.addPass(bloomPass);

const loader = new GLTFLoader();
let pig, text, newPig, landscape;
const pigGroup = new THREE.Group();

// Load pigs and randomize instances
loader.load('./assets/Pig.glb', function (gltf) {
  pig = gltf.scene;
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.translateY(-40)
    }
  });

  pig.scale.set(2, 2, 2);

  for (let i = 0; i < 50; i++) {
    newPig = pig.clone(true);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));
    newPig.position.set(x / 2, y * 9 + 340, z);
    newPig.rotation.set(x, y, z);
    pigGroup.add(newPig);

  }
  scene.add(pigGroup);
}, undefined, function (err) {
  console.error(err);
})

// Load NAMETEXT
loader.load('./assets/NICKALLENTEXT2.glb', function (gltf) {
  text = gltf.scene;
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      console.log('material set');
      obj.material = material;
    } else {
      console.log('material not set');
      console.log(obj);
    }
  });
  text.rotation.x = Math.PI / 2;
  text.position.y = document.body.getBoundingClientRect().top * .01;
  text.scale.set(6, 6, 6)
  scene.add(text);
}, undefined, function (err) {
  console.error(err);
})



//landscape material;
// const landMat = new THREE.MeshBasicMaterial({ color: 0xaa3447, wireframe: true });
// // Load landscape
// loader.load('./assets/eighties.glb', function (gltf) {
//   landscape = gltf.scene;
//   gltf.scene.traverse((obj) => {
//     if (obj.isMesh) {
//       console.log('material set');
//       obj.material = landMat;
//     } else {
//       console.log('material not set');
//       console.log(obj);
//     }
//   });
//   landscape.position.set(0,-35,-2500)
//   landscape.scale.set(15,10,12)

//   scene.add(landscape);
// }, undefined, function (err) {
//   console.error(err);
// })

// Config renderer and composer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// composer.setPixelRatio = window.devicePixelRatio;
// composer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
// renderer.render(scene, camera);
// cssRenderer.render(cssScene, camera);

// Torus
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0xa463aa, wireframe: true});
// const torus = new THREE.Mesh(geometry, material);
// torus.position.set(0,20,-40)
// scene.add(torus);


// const video = document.getElementById( 'eighties-bg' );
// const texture = new THREE.VideoTexture( video );
// const videoGeom = new THREE.PlaneGeometry(20, 10, 1, 1);
// const vidMat = new THREE.MeshBasicMaterial({map: texture}) 

// const plane = new THREE.Mesh(videoGeom, vidMat);
// plane.position.set(0, 0,-50);
// plane.scale.set(10, 10, 10)
// // scene.add(plane);

/* LIGHTS */
// POINT LIGHT
const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffdfff, .3);
scene.add(ambientLight);

/* LISTENERs */
// Resize handling
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  // composer.setSize(window.innerWidth, window.innerHeight);

}

// Scroll functions
window.addEventListener('scroll', (e) => {
  const t = document.body.getBoundingClientRect().top;
  movePig();
  moveText();

  const totalHeight = document.body.clientHeight;
  const percentTotal = (-1 *t)/(totalHeight - window.innerHeight);
  const rightPx = ((t * .1) * -1 - 50);

  let firstDiv = document.getElementsByClassName('info-div')[0];
  let distanceTop = firstDiv.getBoundingClientRect().top;
  let percentFromTop = 1 - (distanceTop / window.innerHeight);
  let infoPos = 0;



  let infos = document.getElementsByClassName('info-div');
  for(let i=0; i<infos.length; i++){
    let div = infos[i];
    // let posLeft = 
    let toLeft = div.getBoundingClientRect().left;
    let toLeftRatio = toLeft/window.innerWidth - div.style.width;
    // let cos = (Math.abs(Math.cos(toLeftRatio * Math.PI)));
    let right = (infoPos + (t * -0.1) - 90 *(i+1)) + '%';

    div.style.right = right;
    div.style.transform = `rotateY(${-90 * (toLeftRatio) + 30}deg)`

  }
})

// NAME scroll handling
function moveText() {
  const t = document.body.getBoundingClientRect().top;
  
  // const goalDistance = Math.abs((15 / text.position.y)) - 1;
  // console.log(goalDistance)
  text.position.y = 0 - (t * .002);
}

// PIG scroll handling
function movePig() {
  const t = document.body.getBoundingClientRect().top;

  pig.position.x = t * .01;
  pigGroup.position.y = t * .1;

  for (let pig of pigGroup.children) {
    pig.rotation.y = t * .01;
    pig.rotation.z = t * .01;
  }
}

///// FRAME BY FRAME ANIMATION
function animate() {
  requestAnimationFrame(animate);

  if(landscape){
    landscape.position.z += .2 ;
    let reset = 384 * 2
    if (landscape.position.z > -2500 + reset) {
      landscape.position.z -= reset;
    }
  }

  // torus.rotation.x += .01;
  // loader.rotation.x += .2;
  if (pig) {
    pig.rotation.x += .05;
    pig.rotation.y += .02;
  }

  renderer.render(scene, camera);
}

animate();