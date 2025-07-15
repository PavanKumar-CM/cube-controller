let scene, camera, renderer, cube;
let rotationSpeed = 0.01;
let position = { x: 0, y: 0.0, z: 0 }; 
const API_URL = 'http://localhost:5000/api/cubes/cube_1';

function init() {
    scene = new THREE.Scene(); // 3D world
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Creates the camera
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') }); // WebGL Model
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);

    // Created white edges around the cube
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, edgeMaterial);
    cube.add(wireframe);

    scene.add(cube);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    camera.position.set(0, 0.3, 5);

    // Updated the Cube rotationSpeed live    
    document.getElementById('rotationSlider').addEventListener('input', e => {
        rotationSpeed = parseFloat(e.target.value);
    });

    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    loadCube(); // Moved before animate to prevent flicker
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += rotationSpeed;
    cube.position.set(position.x, position.y, position.z);
    renderer.render(scene, camera);
}

function move(dir) {
    const step = 0.1; // start 0.1
    const boundary = 2;// end 2 prevent the slider from going off screen

    if (dir === 'up' && position.y < boundary) position.y += step;
    if (dir === 'down' && position.y > -boundary) position.y -= step;
    if (dir === 'left' && position.x > -boundary) position.x -= step;
    if (dir === 'right' && position.x < boundary) position.x += step;
}


function resetCube() {
    showFeedback("Resetting...");
    fetch(`${API_URL}/reset`, { method: 'POST' }) // POST Request send to the backend 
        .then(res => res.json())
        .then(data => {
            if (data.success) { // true
                position = data.data.position;
                rotationSpeed = data.data.rotationSpeed;
                document.getElementById('rotationSlider').value = rotationSpeed; // Set rotationSpeed = 0.1(Default)
                showFeedback("Reset complete."); 
            } else {
                showFeedback("Reset failed!");
            }
        })
        .catch(err => {
            console.error('Reset error:', err);
            showFeedback("Reset failed!");
        });
}

function saveCube() {
    showFeedback("Saving...");
    fetch(`${API_URL}/save`, {
        method: 'POST', // POST Request send to the backend 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, rotationSpeed })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) { // true
                showFeedback("Saved successfully!");
            } else { // false
                showFeedback("Save failed!");
            }
        })
        .catch(err => {
            console.error('Save error:', err);
            showFeedback("Save failed!");
        });
}


function getCubeState() {
    showFeedback("Loading saved state...");
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.position && data.rotationSpeed !== undefined) {
                position = data.position;
                rotationSpeed = data.rotationSpeed;
                document.getElementById('rotationSlider').value = rotationSpeed;
                showFeedback("Loaded saved state!");
            } else {
                showFeedback("No saved state found!");
            }
        })
        .catch(err => {
            console.error('Get state error:', err);
            showFeedback("Failed to load saved state!");
        });
}

function loadCube() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.position && data.rotationSpeed !== undefined) {
                position = data.position;
                rotationSpeed = data.rotationSpeed;
                document.getElementById('rotationSlider').value = rotationSpeed;
            } else {
                position = { x: 0, y: 0.0, z: 0 };
                rotationSpeed = 0.01; 
                document.getElementById('rotationSlider').value = rotationSpeed;
            }
        })
        .catch(err => {
            console.error('Load error:', err);
            position = { x: 0, y: 0.0, z: 0 };
            rotationSpeed = 0.01; 
            document.getElementById('rotationSlider').value = rotationSpeed;
        });
}


function showFeedback(msg) { // Above Function calls showFeedback(msg) in last 
    const message = document.getElementById('feedback'); // Store in message
    message.textContent = msg; // message content in msg
    setTimeout(() => message.textContent = '', 2000); // Sleep till 2000 ms = 2s
}

init();
