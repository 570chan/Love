// ================================
// LOVE ENGINE V2
// Part 1 - Core
// ================================

// ---------- Config ----------
const CONFIG = {
    cameraFov: 75,
    near: 0.1,
    far: 1000,

    startDistance: 20,
    minZoom: 5,
    maxZoom: 50,

    rotateSpeed: 0.003,
    smooth: 0.08,

    background: 0x000000
};

// ---------- Scene ----------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    CONFIG.cameraFov,
    window.innerWidth / window.innerHeight,
    CONFIG.near,
    CONFIG.far
);

camera.position.set(0, 0, CONFIG.startDistance);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

document
    .getElementById("threejs-canvas")
    .appendChild(renderer.domElement);


// ================================
// Camera Control
// ================================

let targetRotationY = 0;
let targetRotationX = 0;

let dragging = false;

let lastX = 0;
let lastY = 0;

renderer.domElement.addEventListener("mousedown", e => {

    dragging = true;

    lastX = e.clientX;
    lastY = e.clientY;

});

window.addEventListener("mouseup", () => {

    dragging = false;

});

window.addEventListener("mousemove", e => {

    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;

    targetRotationY += dx * CONFIG.rotateSpeed;

    targetRotationX += dy * CONFIG.rotateSpeed;

    targetRotationX = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotationX)
    );

});


// ================================
// Touch
// ================================

renderer.domElement.addEventListener("touchstart", e => {

    if (e.touches.length !== 1) return;

    dragging = true;

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;

});

window.addEventListener("touchend", () => {

    dragging = false;

});

window.addEventListener("touchmove", e => {

    if (!dragging) return;

    if (e.touches.length !== 1) return;

    const dx =
        e.touches[0].clientX - lastX;

    const dy =
        e.touches[0].clientY - lastY;

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;

    targetRotationY += dx * CONFIG.rotateSpeed;

    targetRotationX += dy * CONFIG.rotateSpeed;

});


// ================================
// Zoom
// ================================

renderer.domElement.addEventListener("wheel", e => {

    e.preventDefault();

    camera.position.z += e.deltaY * 0.01;

    camera.position.z = Math.max(

        CONFIG.minZoom,

        Math.min(
            CONFIG.maxZoom,
            camera.position.z
        )

    );

});


// ================================
// Resize
// ================================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});


// ================================
// Heart Texture Loader
// ================================

async function loadHeartTexture(
    path = "./heart.png"
) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => {

            const canvas =
                document.createElement("canvas");

            canvas.width = 256;
            canvas.height = 256;

            const ctx =
                canvas.getContext("2d");

            ctx.shadowColor = "#ff5ea8";
            ctx.shadowBlur = 25;

            ctx.drawImage(
                img,
                64,
                64,
                128,
                128
            );

            const texture =
                new THREE.CanvasTexture(canvas);

            texture.needsUpdate = true;

            resolve(texture);

        };

        img.onerror = reject;

        img.src = path;

    });

}


// ================================
// Global Arrays
// ================================

const textMeshes = [];

const heartMeshes = [];

const starMeshes = [];

const shootingStars = [];


// ================================
// Render Helper
// ================================

function updateCamera() {

    camera.rotation.y +=
        (targetRotationY - camera.rotation.y)
        * CONFIG.smooth;

    camera.rotation.x +=
        (targetRotationX - camera.rotation.x)
        * CONFIG.smooth;

}

const textureCache = new Map();

function createTextTexture(text){

    if(textureCache.has(text))
        return textureCache.get(text);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 256;

    ctx.clearRect(0,0,512,256);

    ctx.font = "bold 80px Arial";

    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.shadowColor="#ff69b4";
    ctx.shadowBlur=35;

    ctx.fillStyle="white";

    ctx.fillText(text,256,128);

    ctx.strokeStyle="#ffffff";

    ctx.lineWidth=2;

    ctx.strokeText(text,256,128);

    const texture=new THREE.CanvasTexture(canvas);

    texture.needsUpdate=true;

    const data={
        texture,
        aspect:canvas.width/canvas.height
    };

    textureCache.set(text,data);

    return data;

}



// ------------------------------
// Heart Equation
// ------------------------------

function heartPoint(){

    const t=Math.random()*Math.PI*2;

    const scale=0.18;

    const x=
    16*Math.pow(Math.sin(t),3);

    const y=
    13*Math.cos(t)
    -5*Math.cos(2*t)
    -2*Math.cos(3*t)
    -Math.cos(4*t);

    const depth=
    (Math.random()-0.5)*8;

    return new THREE.Vector3(

        x*scale,

        y*scale,

        depth

    );

}



// ------------------------------
// Create Text Cloud
// ------------------------------

function createHeartTexts(){

    textMeshes.forEach(m=>scene.remove(m));

    textMeshes.length=0;

    const amount=1200;

    for(let i=0;i<amount;i++){

        const word=
        texts[
            Math.floor(
                Math.random()*texts.length
            )
        ];

        const data=
        createTextTexture(word);

        const geo=
        new THREE.PlaneGeometry(

            1.8*data.aspect,

            1.8

        );

        const mat=
        new THREE.MeshBasicMaterial({

            map:data.texture,

            transparent:true,

            side:THREE.DoubleSide,

            depthWrite:false

        });

        const mesh=
        new THREE.Mesh(geo,mat);

        const p=heartPoint();

        mesh.position.copy(p);

        mesh.position.x+=
            (Math.random()-0.5)*0.45;

        mesh.position.y+=
            (Math.random()-0.5)*0.45;

        mesh.position.z+=
            (Math.random()-0.5)*0.45;

        mesh.rotation.z=
            Math.random()*Math.PI*2;

        const s=
            0.6+
            Math.random()*0.8;

        mesh.scale.setScalar(s);

        mesh.userData={

            phase:
                Math.random()*Math.PI*2,

            speed:
                0.2+
                Math.random()*0.8,

            radius:
                0.04+
                Math.random()*0.05

        };

        scene.add(mesh);

        textMeshes.push(mesh);

    }

}
// ==========================================
// LOVE ENGINE V2
// Part 2 - Heart Cloud
// ==========================================


// ------------------------------
// Text Texture Cache
// ------------------------------

const textureCache = new Map();

function createTextTexture(text){

    if(textureCache.has(text))
        return textureCache.get(text);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 256;

    ctx.clearRect(0,0,512,256);

    ctx.font = "bold 80px Arial";

    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.shadowColor="#ff69b4";
    ctx.shadowBlur=35;

    ctx.fillStyle="white";

    ctx.fillText(text,256,128);

    ctx.strokeStyle="#ffffff";

    ctx.lineWidth=2;

    ctx.strokeText(text,256,128);

    const texture=new THREE.CanvasTexture(canvas);

    texture.needsUpdate=true;

    const data={
        texture,
        aspect:canvas.width/canvas.height
    };

    textureCache.set(text,data);

    return data;

}



// ------------------------------
// Heart Equation
// ------------------------------

function heartPoint(){

    const t=Math.random()*Math.PI*2;

    const scale=0.18;

    const x=
    16*Math.pow(Math.sin(t),3);

    const y=
    13*Math.cos(t)
    -5*Math.cos(2*t)
    -2*Math.cos(3*t)
    -Math.cos(4*t);

    const depth=
    (Math.random()-0.5)*8;

    return new THREE.Vector3(

        x*scale,

        y*scale,

        depth

    );

}



// ------------------------------
// Create Text Cloud
// ------------------------------

function createHeartTexts(){

    textMeshes.forEach(m=>scene.remove(m));

    textMeshes.length=0;

    const amount=1200;

    for(let i=0;i<amount;i++){

        const word=
        texts[
            Math.floor(
                Math.random()*texts.length
            )
        ];

        const data=
        createTextTexture(word);

        const geo=
        new THREE.PlaneGeometry(

            1.8*data.aspect,

            1.8

        );

        const mat=
        new THREE.MeshBasicMaterial({

            map:data.texture,

            transparent:true,

            side:THREE.DoubleSide,

            depthWrite:false

        });

        const mesh=
        new THREE.Mesh(geo,mat);

        const p=heartPoint();

        mesh.position.copy(p);

        mesh.position.x+=
            (Math.random()-0.5)*0.45;

        mesh.position.y+=
            (Math.random()-0.5)*0.45;

        mesh.position.z+=
            (Math.random()-0.5)*0.45;

        mesh.rotation.z=
            Math.random()*Math.PI*2;

        const s=
            0.6+
            Math.random()*0.8;

        mesh.scale.setScalar(s);

        mesh.userData={

            phase:
                Math.random()*Math.PI*2,

            speed:
                0.2+
                Math.random()*0.8,

            radius:
                0.04+
                Math.random()*0.05

        };

        scene.add(mesh);

        textMeshes.push(mesh);

    }

}

function createStars(){

    const geo =
        new THREE.BufferGeometry();

    const count = 2500;

    const vertices=[];

    for(let i=0;i<count;i++){

        vertices.push(

            (Math.random()-0.5)*120,

            (Math.random()-0.5)*120,

            (Math.random()-0.5)*120

        );

    }

    geo.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(

            vertices,

            3

        )

    );

    const mat=new THREE.PointsMaterial({

        color:0xffffff,

        size:0.08,

        transparent:true,

        opacity:0.9

    });

    const stars=new THREE.Points(

        geo,

        mat

    );

    scene.add(stars);

    starMeshes.push(stars);

}



// --------------------------
// Floating Hearts
// --------------------------

function createHearts(texture){

    const geo=

        new THREE.PlaneGeometry(

            1,

            1

        );

    for(let i=0;i<80;i++){

        const mat=

        new THREE.MeshBasicMaterial({

            map:texture,

            transparent:true,

            side:THREE.DoubleSide,

            depthWrite:false

        });

        const mesh=

        new THREE.Mesh(

            geo,

            mat

        );

        mesh.position.set(

            (Math.random()-0.5)*30,

            (Math.random()-0.5)*20,

            (Math.random()-0.5)*30

        );

        const scale=

            0.4+

            Math.random()*1.5;

        mesh.scale.setScalar(scale);

        mesh.userData={

            speed:

                0.2+

                Math.random()*0.5,

            drift:

                Math.random()*2,

            phase:

                Math.random()*6.28

        };

        scene.add(mesh);

        heartMeshes.push(mesh);

    }

}



// --------------------------
// Shooting Stars
// --------------------------

function spawnShootingStar(){

    const geo=

        new THREE.SphereGeometry(

            0.12,

            8,

            8

        );

    const mat=

        new THREE.MeshBasicMaterial({

            color:0xffffff

        });

    const star=

        new THREE.Mesh(

            geo,

            mat

        );

    star.position.set(

        -40,

        Math.random()*30,

        -40

    );

    star.userData={

        velocity:new THREE.Vector3(

            0.7+

            Math.random()*0.5,

            -0.3,

            1+

            Math.random()*0.4

        ),

        trail:[]

    };

    scene.add(star);

    shootingStars.push(star);

}



// --------------------------
// Update Hearts
// --------------------------

function updateHearts(time){

    heartMeshes.forEach(h=>{

        h.quaternion.copy(

            camera.quaternion

        );

        h.position.y-=

            h.userData.speed*0.03;

        h.position.x+=

            Math.sin(

                time+

                h.userData.phase

            )*0.01;

        if(h.position.y<-12){

            h.position.y=12;

            h.position.x=

                (Math.random()-0.5)*25;

        }

    });

}



// --------------------------
// Update Shooting Stars
// --------------------------

function updateShootingStars(){

    if(Math.random()<0.01)

        spawnShootingStar();

    shootingStars.forEach(

        (star,index)=>{

        star.position.add(

            star.userData.velocity

        );

        if(

            star.position.z>20 ||

            star.position.y<-30

        ){

            scene.remove(star);

            shootingStars.splice(

                index,

                1

            );

        }

    });

}



// --------------------------
// Update Background
// --------------------------

function updateBackground(time){

    starMeshes.forEach(stars=>{

        stars.rotation.y+=0.00015;

        stars.rotation.x=

            Math.sin(time*0.05)

            *0.05;

    });

    updateHearts(time);

    updateShootingStars();

}

const clock = new THREE.Clock();

let autoRotate = true;

let autoAngle = 0;


// Khi người dùng kéo chuột thì tạm dừng auto rotate
renderer.domElement.addEventListener("mousedown", () => {

    autoRotate = false;

});

window.addEventListener("mouseup", () => {

    setTimeout(() => {

        autoRotate = true;

    },2000);

});

renderer.domElement.addEventListener("touchstart",()=>{

    autoRotate=false;

});

window.addEventListener("touchend",()=>{

    setTimeout(()=>{

        autoRotate=true;

    },2000);

});


// -----------------------
// Camera
// -----------------------

function updateCameraMotion(delta){

    if(autoRotate){

        autoAngle += delta*0.18;

        targetRotationY = autoAngle;

    }

    camera.rotation.y +=

        (targetRotationY-camera.rotation.y)

        *0.08;

    camera.rotation.x +=

        (targetRotationX-camera.rotation.x)

        *0.08;

}


// -----------------------
// Billboard
// -----------------------

function updateBillboards(){

    const q=camera.quaternion;

    textMeshes.forEach(mesh=>{

        mesh.quaternion.copy(q);

    });

    heartMeshes.forEach(mesh=>{

        mesh.quaternion.copy(q);

    });

}


// -----------------------
// Pulse
// -----------------------

function updateHeartCloud(time){

    textMeshes.forEach(mesh=>{

        const pulse =

            1 +

            Math.sin(

                time*

                mesh.userData.speed +

                mesh.userData.phase

            ) *

            mesh.userData.radius;

        mesh.scale.setScalar(pulse);

    });

}


// -----------------------
// Glow
// -----------------------

function updateGlow(time){

    const glow=

        0.92+

        Math.sin(time*2)*0.08;

    textMeshes.forEach(mesh=>{

        mesh.material.opacity=

            glow;

    });

}


// -----------------------
// Background Float
// -----------------------

function updateSceneFloat(time){

    scene.position.y=

        Math.sin(time*0.5)

        *0.25;

}


// -----------------------
// Main Loop
// -----------------------

function animate(){

    requestAnimationFrame(animate);

    const delta=

        clock.getDelta();

    const time=

        clock.elapsedTime;

    updateCameraMotion(delta);

    updateBillboards();

    updateHeartCloud(time);

    updateBackground(time);

    updateGlow(time);

    updateSceneFloat(time);

    renderer.render(

        scene,

        camera

    );

}
