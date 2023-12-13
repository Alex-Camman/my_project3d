import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, globe, neonLight, neonLightFlicker, atmosphere, imageMesh, particleSystem;
let globeRotation;

function init() {
    // Scene, Camera, and Renderer setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvasContainer').appendChild(renderer.domElement);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Relative paths to assets
    const assetsPath = '/home/fedora/my_project/src/assets/';
    
    // Globe with Earth Texture
    const globeTexture = textureLoader.load(`${assetsPath}2k_earth_daymap.jpg`); 
    const globeMaterial = new THREE.MeshPhongMaterial({ map: globeTexture });
    globe = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), globeMaterial);
    scene.add(globe);

    // Globe Rotation
    globeRotation = new THREE.AnimationMixer(globe);
    const rotateAction = globeRotation.clipAction(new THREE.AnimationClip('rotate', -1, [new THREE.VectorKeyframeTrack('.rotation[y]', [0, 30], [0, Math.PI * 2])]));
    rotateAction.play();

    // Neon Light
    neonLight = new THREE.PointLight(0xff0000, 2, 100);
    neonLight.position.set(5, 5, 5);
    scene.add(neonLight);

    // Neon Light Flickering
    neonLightFlicker = new THREE.AnimationMixer(neonLight);
    const flickerAction = neonLightFlicker.clipAction(new THREE.AnimationClip('flicker', -1, [new THREE.NumberKeyframeTrack('.intensity', [0, 1, 2, 3], [0.5, 2, 0.5, 2])]));
    flickerAction.play();

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Atmosphere Effect
    atmosphere = createAtmosphere();
    scene.add(atmosphere);

    // Image of Orville
    const orvilleTexture = textureLoader.load(`${assetsPath}orville.jpeg`); 
    imageMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: orvilleTexture, transparent: true, opacity: 0.7 }));
    imageMesh.position.set(0, 0, 2);
    scene.add(imageMesh);

    // Particle System
    particleSystem = createParticleSystem();
    scene.add(particleSystem);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Resize Listener
    window.addEventListener('resize', onWindowResize, false);

    // Start Animation Loop
    animate();
}

function createAtmosphere() {
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowStrength: { value: 0.5 },
            // ... (shader uniforms)
        },
        vertexShader: `...`,  // (vertex shader code)
        fragmentShader: `...`,  // (fragment shader code)
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    return new THREE.Mesh(new THREE.SphereGeometry(2.05, 50, 50), shaderMaterial);
}

function createParticleSystem() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ size: 0.025, color: 0xffffff });
    return new THREE.Points(particleGeometry, particleMaterial);
}

function animate() {
    requestAnimationFrame(animate);

    // Update Animations
    const delta = clock.getDelta();
    globeRotation.update(delta);
    neonLightFlicker.update(delta);

    // Rotate Globe and Atmosphere
    globe.rotation.y += 0.005;
    atmosphere.rotation.y += 0.005;

    // Update Particle System
    particleSystem.rotation.y += 0.001;

    // Render Scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
</script>
