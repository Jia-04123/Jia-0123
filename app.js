import * as THREE from './libs/three/three.module.js';
import { GLTFLoader } from './libs/three/jsm/GLTFLoader.js';
import { DRACOLoader } from './libs/three/jsm/DRACOLoader.js';
import { RGBELoader } from './libs/three/jsm/RGBELoader.js';
import { Stats } from './libs/stats.module.js';
import { LoadingBar } from './libs/LoadingBar.js';
import { VRButton } from './libs/VRButton.js';
import { CanvasUI } from './libs/CanvasUI.js';
import { GazeController } from './libs/GazeController.js';
import { XRControllerModelFactory } from './libs/three/jsm/XRControllerModelFactory.js';
import { FontLoader } from './libs/three/jsm/loaders/FontLoader.js';
import { TextGeometry } from './libs/three/jsm/geometries/TextGeometry.js';

class App {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.assetsPath = './assets/';

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 500);
        this.camera.position.set(0, 1.6, 0);

        this.dolly = new THREE.Object3D();
        this.dolly.position.set(0, 0, 10);
        this.dolly.add(this.camera);
        this.dummyCam = new THREE.Object3D();
        this.camera.add(this.dummyCam);

        this.scene = new THREE.Scene();
        this.scene.add(this.dolly);

        // ✅ 1. Change background color
        this.scene.background = new THREE.Color(0xECECEC);

        const ambient = new THREE.HemisphereLight(0xFFFFFF, 0xAAAAAA, 0.8);
        this.scene.add(ambient);

        // ✅ 2. Add 3D Box
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x4CC3D9 });
        const box = new THREE.Mesh(geometry, material);
        box.position.set(2, 0.5, -4);
        this.scene.add(box);

        // ✅ 3. Add 3D Text
        const fontLoader = new FontLoader();
        fontLoader.load('./libs/three/js/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry("Welcome to My Virtual Building!", {
                font: font,
                size: 0.5,
                height: 0.05
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff5722 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-4, 2, -5);
            this.scene.add(textMesh);
        });

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(this.renderer.domElement);

        this.setEnvironment();

        window.addEventListener('resize', this.resize.bind(this));

        this.clock = new THREE.Clock();
        this.up = new THREE.Vector3(0, 1, 0);
        this.origin = new THREE.Vector3();
        this.workingVec3 = new THREE.Vector3();
        this.workingQuaternion = new THREE.Quaternion();
        this.raycaster = new THREE.Raycaster();

        this.stats = new Stats();
        container.appendChild(this.stats.dom);

        this.loadingBar = new LoadingBar();

        this.loadCollege();

        this.immersive = false;

        const self = this;

        fetch('./college.json')
            .then(response => response.json())
            .then(obj => {
                self.boardShown = '';
                self.boardData = obj;
            });
    }

    // (Other functions like setEnvironment, resize, loadCollege, setupXR, buildControllers, moveDolly, etc.)
    // Just keep the rest of your existing functions as-is.
}

export { App };
