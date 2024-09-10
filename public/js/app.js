// Initialize the scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);

// Add OrbitControls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Smooth camera movements

// Add a basic light
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Set initial camera position
camera.position.set(0, 5, 10);
controls.update();

// Animate loop for rendering
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add objects on button click
document.getElementById('addCube').addEventListener('click', () => {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshStandardMaterial({ color: 0x007bff });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
});

document.getElementById('addSphere').addEventListener('click', () => {
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let material = new THREE.MeshStandardMaterial({ color: 0xff5500 });
    let sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
});

// Save model (export to GLTF)
document.getElementById('saveModel').addEventListener('click', () => {
    const exporter = new THREE.GLTFExporter();
    exporter.parse(scene, (result) => {
        const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'model.gltf';
        link.click();
    });
});