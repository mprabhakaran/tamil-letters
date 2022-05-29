import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js'
import {VRButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js'
import {ARButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/ARButton.js'
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/XRControllerModelFactory.js'
import {BoxLineGeometry} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/BoxLineGeometry.js'

let tempMatrix = new THREE.Matrix4();
let hit = false;


//random
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(50,window.innerWidth/innerHeight,0.01,1000);
camera.position.set(0,0.5,5);
scene.add(camera);


//renderer
const renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha:true
});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;

//enable VR
document.body.appendChild(ARButton.createButton(renderer));

//group
const group = new THREE.Group();
scene.add(group);

//raycaster
const raycaster = new THREE.Raycaster();

//reticle
const reticle = new THREE.Mesh(new THREE.RingGeometry(0.1,0.2,32),new THREE.MeshBasicMaterial());
reticle.position.set(0,0,-1)
reticle.scale.set(0.05,0.05,0.05);
camera.add(reticle);

const controller = renderer.xr.getController(0);
scene.add(controller);
controller.addEventListener('select',onStart);


function onStart(){
    hit = true;
    console.log('start');
}


//controls
const controls = new OrbitControls(camera,renderer.domElement);

controls.update()


//geometry
const geometry = new THREE.BoxBufferGeometry(0.3,0.3,0.3);

const box1 = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xff0000}));
box1.position.set(0,0,-5)


group.add(box1);


renderer.setAnimationLoop(animate);

function animate(){

    tempMatrix.identity().extractRotation(reticle.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(reticle.matrixWorld);
    raycaster.ray.direction.set(0,0,-1).applyMatrix4(tempMatrix);

    const intersect = raycaster.intersectObject(box1);

    if(hit == true){
        if(intersect.length > 0){
            intersect[0].object.position.y += 0.01;
        }
        else{
            hit = false;
        }
    }


    renderer.render(scene,camera);
}

