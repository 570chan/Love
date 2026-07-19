// --- 1. KHỞI TẠO CẤU HÌNH BAN ĐẦU ---
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

// Camera góc nhìn Perspective
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height);
document.getElementById("threejs-canvas").appendChild(renderer.domElement);

const radius = 25; // Bán kính vòng tròn phân bố chữ và tim

// --- 2. BIẾN ĐIỀU KHIỂN & VẬT LÝ QUÁN TÍNH ---
let isDragging = false;
let isTouching = false;
let lastX = 0;
let lastTouchX = 0;

let currentRotationY = 0.5;   // Góc xoay hiện tại của camera
let rotationVelocityY = 0;    // Vận tốc xoay hiện tại
const friction = 0.95;        // Lực ma sát (gần 1 lướt càng lâu)
const sensitivity = 0.0015;   // Độ nhạy khi vuốt/kéo

camera.rotation.y = currentRotationY;

// --- 3. BỘ LẮNG NGHE SỰ KIỆN (EVENTS) ---

// Cuộn chuột thu phóng (Zoom)
renderer.domElement.addEventListener("wheel", event => {
  event.preventDefault();
  camera.fov += event.deltaY * 0.05;
  camera.fov = Math.max(30, Math.min(camera.fov, 90));
  camera.updateProjectionMatrix();
});

// Sự kiện Chuột
renderer.domElement.addEventListener("mousedown", event => {
  isDragging = true;
  lastX = event.clientX;
  rotationVelocityY = 0; // Chạm vào thì dừng quán tính cũ ngay lập tức
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", event => {
  if (isDragging) {
    const deltaX = event.clientX - lastX;
    lastX = event.clientX;
    rotationVelocityY = deltaX * sensitivity; // Tính vận tốc dựa trên tốc độ di chuột
  }
});

// Sự kiện Cảm ứng (Mobile)
renderer.domElement.addEventListener("touchstart", event => {
  if (event.touches.length === 1) {
    isTouching = true;
    lastTouchX = event.touches[0].clientX;
    rotationVelocityY = 0; // Chạm vào thì dừng quán tính cũ
  }
});

window.addEventListener("touchend", () => {
  isTouching = false;
});

window.addEventListener("touchmove", event => {
  if (isTouching && event.touches.length === 1) {
    const touchX = event.touches[0].clientX;
    const deltaX = touchX - lastTouchX;
    lastTouchX = touchX;
    rotationVelocityY = deltaX * sensitivity; // Tính vận tốc dựa trên tốc độ vuốt
  }
});

// Tự động điều chỉnh kích thước khi đổi size màn hình
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});


// --- 4. HÀM TẠO TEXTURE & HÌNH ẢNH ---

function loadHeartImage(src = "./heart.png") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function createTextTexture(text) {
  const canvasMeasure = document.createElement("canvas");
  const ctxMeasure = canvasMeasure.getContext('2d');
  let fontSize = 96;
  
  ctxMeasure.font = "bold " + fontSize + "px 'Arial'";
  let textWidth = ctxMeasure.measureText(text).width;
  
  if (textWidth + 200 > 1200) {
    fontSize = Math.floor(fontSize * 1000 / textWidth);
    ctxMeasure.font = "bold " + fontSize + "px 'Arial'";
    textWidth = ctxMeasure.measureText(text).width;
  }
  
  const canvasWidth = Math.ceil(textWidth + 200);
  const mainCanvas = document.createElement("canvas");
  mainCanvas.width = canvasWidth;
  mainCanvas.height = 384;
  
  const ctx = mainCanvas.getContext('2d');
  ctx.font = "bold " + fontSize + "px 'Arial'";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff69b4';
  ctx.shadowBlur = 50;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText(text, mainCanvas.width / 2, mainCanvas.height / 2);
  
  ctx.strokeStyle = '#fff';
  ctx.lineCap = "round";
  ctx.lineWidth = 2;
  ctx.strokeText(text, mainCanvas.width / 2, mainCanvas.height / 2);
  
  return {
    texture: new THREE.CanvasTexture(mainCanvas),
    aspect: mainCanvas.width / mainCanvas.height
  };
}

function createHeartTexture(imgElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowColor = "#ff69b4";
  ctx.shadowBlur = 30;
  
  const w = canvas.width / 2;
  const h = canvas.height / 2;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(imgElement, x, y, w, h);
  
  return new THREE.CanvasTexture(canvas);
}


// --- 5. TẠO CÁC HIỆU ỨNG TRONG KHÔNG GIAN ---

let starMeshes = [];
function createStars() {
  const geo = new THREE.SphereGeometry(0.07, 6, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 800; i++) {
    const mesh = new THREE.Mesh(geo, mat);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const dist = 50 + Math.random() * 20;
    
    mesh.position.x = dist * Math.sin(phi) * Math.cos(theta);
    mesh.position.y = dist * Math.sin(phi) * Math.sin(theta);
    mesh.position.z = dist * Math.cos(phi);
    scene.add(mesh);
    starMeshes.push(mesh);
  }
}

let textMeshes = [];
function createFallingTexts() {
  textMeshes.forEach(mesh => scene.remove(mesh));
  textMeshes = [];
  
  for (let i = 0; i < 350; i++) {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const { texture, aspect } = createTextTexture(randomText);
    texture.needsUpdate = true;
    
    const planeW = 3 * aspect;
    const geo = new THREE.PlaneGeometry(planeW, 3);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    
    const angle = Math.random() * Math.PI * 2;
    const randomRadius = radius + (Math.random() - 0.5) * 6;
    mesh.position.x = Math.cos(angle) * randomRadius;
    mesh.position.y = Math.random() * 50 - 25;
    mesh.position.z = Math.sin(angle) * randomRadius;
    
    mesh.userData = {
      phase: Math.random() * Math.PI * 2,
      angle: angle 
    };
    scene.add(mesh);
    textMeshes.push(mesh);
  }
}

let heartMeshes = [];
function createFallingHearts(heartTexture) {
  heartMeshes.forEach(mesh => scene.remove(mesh));
  heartMeshes = [];
  
  for (let i = 0; i < 60; i++) {
    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: heartTexture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    
    const angle = Math.random() * Math.PI * 2;
    const randomRadius = (radius - 2) + (Math.random() - 0.5) * 8;
    mesh.position.x = Math.cos(angle) * randomRadius;
    mesh.position.y = Math.random() * 50 - 25;
    mesh.position.z = Math.sin(angle) * randomRadius;
    
    const scale = 1.0 + Math.random() * 1.5;
    mesh.scale.set(scale, scale, 1);
    mesh.userData = { angle: angle };
    scene.add(mesh);
    heartMeshes.push(mesh);
  }
}

let shootingStars = [];
function spawnShootingStar() {
  const geo = new THREE.SphereGeometry(0.15, 8, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
  const mesh = new THREE.Mesh(geo, mat);
  
  const angle = Math.random() * Math.PI * 2;
  mesh.position.x = Math.cos(angle) * 40;
  mesh.position.y = Math.random() * 30 + 10;
  mesh.position.z = Math.sin(angle) * 40;
  
  mesh.userData = {
    vx: (Math.random() - 0.5) * 0.5,
    vy: -0.3 - Math.random() * 0.2,
    vz: (Math.random() - 0.5) * 0.5,
    tail: []
  };
  scene.add(mesh);
  shootingStars.push(mesh);
}


function animate() {
  requestAnimationFrame(animate);

  // --- APPLYING INERTIAL PHYSICS TO CAMERAS ---
  if (!isDragging && !isTouching) {
    rotationVelocityY *= friction; 
  }
  currentRotationY += rotationVelocityY;
  camera.rotation.y = currentRotationY;
  
  if (Math.abs(rotationVelocityY) < 0.0001) {
    rotationVelocityY = 0; 
  }
  // ------------------------------------------

  const timeNow = Date.now();

  // falling text effect.
  textMeshes.forEach(mesh => {
    mesh.lookAt(camera.position); 
    mesh.position.y -= 0.025 + Math.random() * 0.005;
    
    if (mesh.position.y < -20) {
      mesh.position.y = Math.random() * 15 + 20;
      const newAngle = Math.random() * Math.PI * 2;
      const randomRadius = radius + (Math.random() - 0.5) * 6;
      mesh.position.x = Math.cos(newAngle) * randomRadius;
      mesh.position.z = Math.sin(newAngle) * randomRadius;
    }

    // gradient text
    const wave = (Math.sin(timeNow * 0.0005 + mesh.userData.phase) + 1) / 2;
    const r = Math.round(255 + (255 - 255) * wave);
    const g = Math.round(255 + (105 - 255) * wave);
    const b = Math.round(255 + (180 - 255) * wave);
    const hexColor = r << 16 | g << 8 | b;
    mesh.material.color.setHex(hexColor);
  });

  // head fall
  heartMeshes.forEach(mesh => {
    mesh.lookAt(camera.position);
    mesh.position.y -= 0.04 + Math.random() * 0.02;
    
    if (mesh.position.y < -20) {
      mesh.position.y = Math.random() * 15 + 20;
      const newAngle = Math.random() * Math.PI * 2;
      const randomRadius = (radius - 2) + (Math.random() - 0.5) * 8;
      mesh.position.x = Math.cos(newAngle) * randomRadius;
      mesh.position.z = Math.sin(newAngle) * randomRadius;
    }
  });

  shootingStars.forEach((star, index) => {
    if (star.userData.tail.length > 20) {
      star.userData.tail.shift();
    }
    star.userData.tail.push({ x: star.position.x, y: star.position.y, z: star.position.z });
    
    star.position.x += star.userData.vx;
    star.position.y += star.userData.vy;
    star.position.z += star.userData.vz;

    // Vẽ đuôi
    for (let i = 0; i < star.userData.tail.length - 1; i++) {
      const p1 = star.userData.tail[i];
      const p2 = star.userData.tail[i + 1];
      const geoTail = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y, p2.z)
      ]);
      const matTail = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15 + 0.25 * (i / star.userData.tail.length)
      });
      const line = new THREE.Line(geoTail, matTail);
      scene.add(line);
      setTimeout(() => scene.remove(line), 40); 
    }
    star.material.opacity = 0.8;
    
    const distFromCenter = Math.sqrt(star.position.x**2 + star.position.y**2 + star.position.z**2);
    if (distFromCenter > 70 || star.position.y < -30) {
      scene.remove(star);
      shootingStars.splice(index, 1);
    }
  });

  // Tần suất xuất hiện sao băng
  if (Math.random() < 0.012) {
    spawnShootingStar();
  }
  
  renderer.render(scene, camera);
}

createStars();
createFallingTexts();

loadHeartImage('./heart.png').then(imgElement => {
  const heartTexture = createHeartTexture(imgElement);
  createFallingHearts(heartTexture);
  animate();
}).catch(err => {
  console.error("Không tải được ảnh heart.png, ứng dụng vẫn chạy không có tim.", err);
  animate();
});
