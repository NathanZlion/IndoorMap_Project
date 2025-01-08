import * as THREE from 'three';

function main() {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#globe') });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.7;

    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthmap.jpeg'),
        bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpeg'),
        bumpScale: 1,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    scene.add(earthMesh);

    const pointLight = new THREE.PointLight(0xffffff, 5, 4);
    pointLight.position.set(1, 0.3, 1);
    scene.add(pointLight);

    // Add the clounds to the earth
    const cloudGeometry = new THREE.SphereGeometry(0.52, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthCloud.png'),
        transparent: true
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    let targetRotationX = 0.005;
    let targetRotationY = 0.002;
    let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    const dragFactor = 0.0002;

    const render = () => {
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        cloudMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        cloudMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        renderer.render(scene, camera);
    }

    const animate = () => {
        requestAnimationFrame(animate);
        render();
    }

    animate();

    function onDocumentMouseDown(event) {
        event.preventDefault();
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        mouseXOnMouseDown = event.clientX - windowHalfX;
        mouseYOnMouseDown = event.clientY - windowHalfY;
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        targetRotationX = (mouseX - mouseXOnMouseDown) * dragFactor;
        mouseY = event.clientY - windowHalfY;
        targetRotationY = (mouseY - mouseYOnMouseDown) * dragFactor;
    }

    function onDocumentMouseUp(event) {
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mouseup', onDocumentMouseUp, false);
    }

    // last line of the main function
    document.addEventListener('mousedown', onDocumentMouseDown, false);
}

// outside of the main function
window.onload = main;
