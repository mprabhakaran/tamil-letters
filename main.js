import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js'
import {VRButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js'
import {ARButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/ARButton.js'
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/XRControllerModelFactory.js'
import {BoxLineGeometry} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/BoxLineGeometry.js'

let letter;
const tempMatrix = new THREE.Matrix4();


//random
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


//path of letters array
const letters = [
    'letters/1.glb',
    'letters/2.glb',
    'letters/3.glb',
    'letters/4.glb',
    'letters/5.glb',
    'letters/6.glb',
    'letters/7.glb',
    'letters/8.glb',
    'letters/9.glb',
    'letters/10.glb',
    'letters/11.glb',
    'letters/12.glb',
    'letters/13.glb',
    'letters/14.glb',
    'letters/15.glb',
    'letters/16.glb',
    'letters/17.glb',
    'letters/18.glb'
    
];

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x505050 );

//camera
const camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.01,100);
camera.position.set(0,1.6,3);
scene.add(camera);

//light
const light = new THREE.DirectionalLight( 0xffffff , 1.5 );
light.position.set( 1, 1, 2 ).normalize();
scene.add( light );

//box 
const geo = new THREE.BoxBufferGeometry();
const geoMat = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.3});
const box = new THREE.Mesh(geo,geoMat);
console.log(box.material);
box.scale.set(5,0.5,1.3);
box.visible = false;






//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;

//room
const room = new THREE.LineSegments(
    new BoxLineGeometry(6,6,6,10,10,10),
    new THREE.LineBasicMaterial({color:0x808080})
)
room.geometry.translate(0,3,0);
scene.add(room);


//meshGroup
const meshGroup = new THREE.Group()
scene.add(meshGroup);

//letter mesh
const loader = new GLTFLoader();


const group = new THREE.Group();
scene.add(group);

//plane
const planeGeo = new THREE.PlaneBufferGeometry(1,0.3);
const planeMaterial = new THREE.MeshBasicMaterial({
    opacity:0.5,
    transparent:true
});



//letter mesh loading
for(let i = 0;i<18; i++){
    loader.load(letters[i],(glb)=>{
        letter = glb.scene;
        const mesh = letter.children;
        const m = mesh[0];

        m.rotation.z = getRandomArbitrary(-0.2,0.5)
        m.position.x = getRandomArbitrary(-2,2);
        m.position.y = getRandomArbitrary(0.5,3);
        m.position.z = getRandomArbitrary(-0.5,-3.5);
        m.scale.set(0.2,0.2,0.2);
        
        
        m.add(box.clone());
        group.add(m);
        
    })  
}




const raycaster = new THREE.Raycaster();

//vr button
document.body.appendChild(VRButton.createButton(renderer));


function buildControllers(){
    const controllerModel = new XRControllerModelFactory();
    console.log(controllerModel);
    const controllers = [];

    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,-1)]);

    const line = new THREE.Line(geometry);
    line.name = 'line'
    line.scale.z = 3;

    for(let i=0;i<=1;i++){
        const controller = renderer.xr.getController(i);
        controller.add(line.clone());
        controller.userData.isSelected = false;
        scene.add(controller);

        const controllerGrip = renderer.xr.getControllerGrip(i);
        controllerGrip.add(controllerModel.createControllerModel(controllerGrip));
        scene.add(controllerGrip);

        controllers.push(controller);
    }

    return controllers;
}

const controllers = buildControllers();
const controller = controllers[0];

controller.addEventListener('selectstart',onSelectStart);
controller.addEventListener('selectend',onSelectEnd);

function onSelectStart(){
    controller.children[0].scale.z = 10;
    controller.userData.isSelected = true;
    box.visible = true;

}

function onSelectEnd(){
    
    controller.userData.isSelected = false;
    box.visible = false
    
}

let objInter = [];

function handleControllers(){
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0,0,-1).applyMatrix4(tempMatrix);

    if(controller.userData.isSelected){

        const intersection = raycaster.intersectObjects(group.children);

        let object;
        
        if(intersection.length>0){
            object = intersection[0].object;
            object.visible = true;
            controller.children[0].scale.z = intersection[0].distance;
            
        }
        else{
           
        }

        
    }

}


renderer.setAnimationLoop(animate);

function animate(){
    handleControllers();
    renderer.render(scene,camera);
}




