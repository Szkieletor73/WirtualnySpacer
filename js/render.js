var container;
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener('DOMContentLoaded', function () {
  init();
  render();
});

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.y = 50;

  //white ambient, no shading
  scene = new THREE.Scene();
  ambient = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambient);

  //load the material file and model
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setBaseUrl('assets/');
  mtlLoader.setPath('assets/');
  mtlLoader.load('../model/wydzial.mtl', function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load('../model/wydzial.obj', function (object) {
      scene.add(object);
    });
  });
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

  container.appendChild(renderer.domElement);

  //init camera controls
  controls = new THREE.FirstPersonControls(camera, renderer.domElement);
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  // controls.enableZoom = true;
}

function render() {
  requestAnimationFrame(render);
  controls.update(1);
  renderer.render(scene, camera);
}
