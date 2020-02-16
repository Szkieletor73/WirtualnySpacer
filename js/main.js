var container
var camera, controls, scene, renderer, model
var lighting, ambient, keyLight, fillLight, backLight
var objects = [] // array of collidable objects
var mouselookTimeout = false

document.addEventListener('DOMContentLoaded', function () {
  eventHandlers()
  init()
  render()
})

function init() {
  container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = 0

  // White ambient, no shading
  scene = new THREE.Scene()
  ambient = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambient)

  // Floor
  var geometry = new THREE.PlaneGeometry(1000, 1000)
  var material = new THREE.MeshBasicMaterial({ color: 0xdddddd, side: THREE.DoubleSide })
  var plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = Math.PI / 2
  objects.push(plane)
  scene.add(plane)

  // Instantiate a loader
  var loader = new THREE.GLTFLoader()

  // Array of objects representing the full scene
  var props = [
    {
      path: "assets/wydzial.glb",
      x: 0,
      y: 0,
      z: 0,
      scale: 0.4,
    }
  ]

  // Load all objects
  props.forEach((el) => {
    loader.load(el.path, (gltf) => {
      // extract hitboxes from scene into an array of colliders
      gltf.scene.traverse((child) => {
        if (child.name.includes("hitbox")) {
          objects.push(child)
          // debug
          child.material.wireframe = true
        }
        if (child.type == "Group") child.traverse((subChild) => {
          if (child.name.includes("hitbox")) {
            objects.push(child)
            // debug
            child.material.wireframe = true
          }
        })
      });
      gltf.scene.position.set(el.x, el.y, el.z)
      gltf.scene.scale.set(el.scale, el.scale, el.scale)
      scene.add(gltf.scene)
    })
  })

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"))

  container.appendChild(renderer.domElement)

  // Init camera controls
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 9000)
  controls = new THREE.PointerLockControls(camera, 100, 50, false, objects)
  ScreenOverlay(controls)
  scene.add(controls.getPlayer())
}

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  controls.updateControls()
}


function eventHandlers() {
  // Attach eventHandler hooks for controls

  // Keyboard press handlers
  var onKeyDown = function (event) { if (handleKeyInteraction(event.keyCode, true)) {event.preventDefault(); event.stopPropagation();}  }
  var onKeyUp = function (event) { if (handleKeyInteraction(event.keyCode, false)) { event.preventDefault(); event.stopPropagation(); } }
  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  // Resize Event
  window.addEventListener('resize', onWindowResize, false)
}

function handleKeyInteraction(keyCode, bool, touch = false) {
  // Camera controls - defaults to FPS-like controls
  if(!controls.enabled && !touch) bool = false
  switch (keyCode) {
    case 38: // up
    case 87: // w
      controls.movements.forward = bool
      return true

    case 40: // down
    case 83: // s
      controls.movements.backward = bool
      return true

    case 37: // left
    case 65: // a
      controls.movements.left = bool
      return true

    case 39: // right
    case 68: // d
      controls.movements.right = bool
      return true

    // No need for jumping
    // case 32: // space
    //   if (!isKeyDown && controls.enabled) {
    //     controls.jump()
    //   }
    //   return true

    // case 16: // shift
    //   controls.walk(!bool)
    //   return true

    default:
      return false
    }
}

function touchMove(direction, bool) {
  // Handles input from buttons for touchscreen movement.
  // Init an object that serves as a hashmap of functions, calling the usual movement functions,
  // with an additional "touch" argument set to true, to bypass the usual controls lock
  // if cursor is not locked (which is impossible to do on mobile)
  // This ensures parity of functionality, and saves us from writing redundant code.
  directions = {
    'f': () => {handleKeyInteraction(87, bool, true)},
    'b': () => {handleKeyInteraction(83, bool, true)},
    'l': () => {handleKeyInteraction(65, bool, true)},
    'r': () => {handleKeyInteraction(68, bool, true)}
  }
  directions[direction]()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}