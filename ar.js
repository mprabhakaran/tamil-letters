import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js'
import {VRButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js'
import {ARButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/ARButton.js'

const scene = new THREE.Scene();



//camera
const camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.01,100);
camera.position.set(0,0,10);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;

const geometry = new THREE.RingGeometry( 0.1, 0.2, 32 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
const mesh = new THREE.Mesh( geometry, material );
mesh.position.set(0,0,-10)
camera.add( mesh );

const vec1 = new THREE.Vector3();
const vec2 = new THREE.Vector3();

console.log(camera.matrix);
console.log(camera.matrixWorld);

console.log(mesh.matrix);
console.log(mesh.matrixWorld);
console.log(mesh.getWorldPosition(vec1));



renderer.setAnimationLoop(animate);

function animate(){
    
    renderer.render(scene,camera);
}