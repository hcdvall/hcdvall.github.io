import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// === GLOBAL VARIABLES ===
let scene, camera, renderer, controls, geomObj;
let mouse = { x: 0, y: 0 };
let starGroup;
// === FUNCTIONS ===

function skybox() {
  const loader = new THREE.CubeTextureLoader();
  scene.background = loader.load([
  'Skyboxes/blood/right.png', 'Skyboxes/blood/left.png',
  'Skyboxes/blood/top.png', 'Skyboxes/blood/bottom.png',
  'Skyboxes/blood/front.png', 'Skyboxes/blood/back.png'
]);
}

// Initialize Scene, Camera, and Renderer
function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);
  
  //skybox();
  scene.background = new THREE.Color().setHex(0x131313);
}

// Create and Add Geometry Object
function addGeomObj() {
  const profileTexture = new THREE.TextureLoader().load('src/javascript.svg');
  geomObj = new THREE.Mesh(
     new THREE.BoxGeometry(3, 3, 3), 
     new THREE.MeshBasicMaterial({map: profileTexture})
  );
  // geomObj = new THREE.Mesh(
  //   new THREE.SphereGeometry(5, 10, 16, 100), 
  //   new THREE.MeshStandardMaterial({ color: 0xffd732 })
  // );

  scene.add(geomObj);
}

// Set Up Lighting
function setupLights() {
  const pointLight = new THREE.PointLight(0xffffff, 1000);
  pointLight.position.set(20, 20, 40);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(pointLight, ambientLight);

  // Debug helpers
  //scene.add(new THREE.PointLightHelper(pointLight));
  //scene.add(new THREE.GridHelper(200, 50));
}

// Add Controls
function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Create a Random Star
function addStar() {
  //const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const geometry = new THREE.PlaneGeometry(0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(5*x, 5*y, 5*z);
  
  scene.add(star);
}

// Generate Multiple Stars
// function generateStars(count = 400) {
//   Array(count).fill().forEach(addStar);
// }

function generateStars(count = 400) {
  starGroup = new THREE.Group();

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.PlaneGeometry(0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(5 * x, 5 * y, 5 * z);

    starGroup.add(star);
  }

  scene.add(starGroup);
}

const CameraController = (() => {
  let angle = 0;
  let scrollSpeed = 0;

  function handleScroll(event) {
    scrollSpeed += event.deltaY * 0.00001; // Adjust sensitivity
  }

  function updateCamera(camera) {
    angle += scrollSpeed;
    scrollSpeed *= 0.95; // Add friction to slow down rotation over time

    let radius = 30;
    camera.position.x = radius * Math.sin(angle);
    camera.position.z = radius * Math.cos(angle);
    camera.position.y = 10 * Math.sin(angle / 2); // Optional vertical motion

    camera.lookAt(0, 0, 0);
  }

  // Attach event listener
  window.addEventListener("wheel", handleScroll);

  return { updateCamera };
})();

function handleMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', handleMouseMove);

function animate() {
  requestAnimationFrame(animate);

  CameraController.updateCamera(camera);

  if (controls) {
    controls.update();
  }

  if (starGroup) {
    starGroup.position.x += (mouse.x * 2 - starGroup.position.x) * 0.01;
    starGroup.position.y += (mouse.y * 2 - starGroup.position.y) * 0.01;

    starGroup.rotation.y += (mouse.x * 0.01 - starGroup.rotation.y) * 0.05;
    starGroup.rotation.x += (mouse.y * 0.01 - starGroup.rotation.x) * 0.05;
  }

  renderer.render(scene, camera);
}




// === MAIN FUNCTION ===
function main() {
  initScene();
  //addGeomObj();
  setupLights();
  setupControls();
  generateStars();
  animate();
}

// Run Main
main();
