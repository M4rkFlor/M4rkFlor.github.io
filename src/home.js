const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
const raycaster = new THREE.Raycaster();

//let cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.PointLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 10);
scene.add(directionalLight);
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientlight);

function handleMouse() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes;
        if (previousFace != intersects[0].face.a) {
            //3 vertices of face, RGB
            color.setXYZ(intersects[0].face.a, 0.5, 0.5, 0.5);
            color.setXYZ(intersects[0].face.b, 0.5, 0.5, 0.5);
            color.setXYZ(intersects[0].face.c, 0.5, 0.5, 0.5);

            intersects[0].object.geometry.attributes.color.needsUpdate = true;
            if(!fadeVertextColorQ.has(intersects[0].face.a)){
                fadeVertextColorQ.add(intersects[0].face.a);
            }
            if(!fadeVertextColorQ.has(intersects[0].face.b)){
                fadeVertextColorQ.add(intersects[0].face.b);
            }
            if(!fadeVertextColorQ.has(intersects[0].face.c)){
                fadeVertextColorQ.add(intersects[0].face.c);
            }

            previousFace = intersects[0].face.a;
        }
    }
}

function updatePlane() {
    //plane.geometry.getAttribute("position").setX(0,-10);
    vertPos = plane.geometry.attributes.position.array;
    indices = plane.geometry.attributes.position.count;
    //update location
    for (let i = 0; i < indices; i++) {
        index = i * 3
        vertPos[index] = initalPositions[index] + Math.sin((frame/360)*Math.PI*2 + initalPositions[index]) * 0.1;
        vertPos[index + 1] = initalPositions[index+1] + Math.cos((frame/360)*Math.PI*2 + initalPositions[index+1]) * 0.1;
        vertPos[index + 2] = initalPositions[index+2] + Math.cos((frame/360)*Math.PI*2 + initalPositions[index+2]) * 0.1;
    }
    //update color
    //random walk color overtime
    //for (let i = 0; i < plane.geometry.attributes.color.count * 3; i++) {
    //    x =  + (Math.random() - 0.5) * 0.03
    //    plane.geometry.attributes.color.array[i] = x; //x - Math.floor(x/1.0);
    //}
    let fadeDecay = 0.01;
    for (let index of fadeVertextColorQ) {
        let newColor = plane.geometry.attributes.color.getX(index) -  fadeDecay;
        if (newColor <= fadeDecay+0.00001){
            plane.geometry.attributes.color.setXYZ(index, 0, 0, 0);
            fadeVertextColorQ.delete(index);
        }else{
            plane.geometry.attributes.color.setXYZ(index, newColor, newColor, newColor);
        }
    }

    //recalculate normals
    //recalculate uv if needed
    //plane.geometry.computeBoundingBox();
    //plane.geometry.computeBoundingSphere();
    //plane.geometry.computeVertexNormals();
    plane.geometry.attributes.position.needsUpdate = true;
    plane.geometry.attributes.color.needsUpdate = true;
}

function makePlane(width, height, widthSegments, heightSegments) {
    let geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments); //width, height, widthSegments, heightSegments
    //Randomized starting geometry
    vertPos = geometry.attributes.position.array;
    indices = geometry.attributes.position.count;
    let smoothness = 1.2;
    for (let i = 0; i < indices; i++) {
        index = i * 3
        vertPos[index] += (Math.random() - 0.5) / smoothness;
        vertPos[index + 1] += (Math.random() - 0.5) / smoothness;
        vertPos[index + 2] += (Math.random() - 0.5) / smoothness;
    }
    initalPositions = [...vertPos];
    //Color
    const colors = [];
    for (let i = 0; i < geometry.attributes.position.count; i++) {
        colors.push(0, 0, 0);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.MeshPhongMaterial({
        wireframe: false,
        vertexColors: true,
        flatShading: THREE.FlatShading
    });

    let plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    return plane
}


const mouse = {
    x: undefined,
    y: undefined
}
let initalPositions;
let plane = makePlane(75, 50, 150, 100);
let frame = 0
let previousFace = null;
const fadeVertextColorQ = new Set();
const clock = new THREE.Clock();
let totalTime = 0;
function animate() {
    requestAnimationFrame(animate);
    totalTime = clock.getElapsedTime();
    handleMouse();
    updatePlane();
    plane.position.y = Math.sin(totalTime)*0.2;
    //plane.position.x = Math.sin(totalTime)*0.1;
    frame += 1
    if (frame == 360) {
        frame = 0
    }
    renderer.render(scene, camera);
}
animate();


addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(devicePixelRatio);
}

el = document.getElementById("Projects");
el.addEventListener("click", handleClassChange);
function handleClassChange(){
    //change class tags from show to hidden
    //change Projects 
}