import GUI from 'lil-gui';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { Planet } from './components/Planet';
import { planets } from './contants/planets';

import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 15;
camera.position.y = 15;

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.gui = new GUI();
gui.domElement.id = 'gui';

// Loader
const textureLoader = new THREE.TextureLoader();

// Particles
const count = 1000000;
const particlesGeometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < count; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // x
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // y
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // z
}
particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    sizeAttenuation: false,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Controls
const controls = new TrackballControls(camera, canvas);

// Helpers
const gridHelper = new THREE.GridHelper(100, 100);
gridHelper.visible = false;
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
axesHelper.visible = false;
scene.add(axesHelper);

const lightsHelper = new THREE.PointLightHelper(pointLight, 0.2);
lightsHelper.visible = false;
scene.add(lightsHelper);

// Planets
const planetObjects = planets.map((planet) => {
    planet.texture = textureLoader.load(planet.texture);
    const planetObject = new Planet(planet);
    scene.add(planetObject.mesh);
    scene.add(planetObject.orbit);
    return planetObject;
});

gui.close();
gui.add(gridHelper, 'visible').name('Grid');
gui.add(axesHelper, 'visible').name('Axes');
gui.add(lightsHelper, 'visible').name('Lights');

const tick = () => {
    controls.update();
    planetObjects.forEach((planet) => planet.update());
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
