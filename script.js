  function loadHeartImage(_0x48496b = "./heart.png") {
    return new Promise((_0x3b1e3e, _0x2d92af) => {
      const _0x1299f9 = new Image();
      _0x1299f9.onload = () => _0x3b1e3e(_0x1299f9);
      _0x1299f9.onerror = _0x2d92af;
      _0x1299f9.src = _0x48496b;
    });
  }
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    'alpha': true,
    'powerPreference': "high-performance", // Ép trình duyệt dùng GPU rời hiệu năng cao
    'antialias': false // Tắt khử răng cưa nếu muốn mượt tối đa trên mobile (có thể bật lại nếu cần nét)
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Giới hạn pixel ratio tối đa là 2 để tránh giật lag màn hình 2K/4K
  document.getElementById("threejs-canvas").appendChild(renderer.domElement);
  
  camera.position.set(0, 0, 0);
  camera.rotation.y = 0.5;

  // Tạo đối tượng kiểm tra vùng nhìn thấy của Camera (Frustum)
  const frustum = new THREE.Frustum();
  const cameraViewProjectionMatrix = new THREE.Matrix4();

  renderer.domElement.addEventListener("wheel", _0x1f6767 => {
    _0x1f6767.preventDefault();
    camera.fov += _0x1f6767.deltaY * 0.05;
    camera.fov = Math.max(30, Math.min(camera.fov, 90));
    camera.updateProjectionMatrix();
  });

  // Tối ưu Texture: Chỉ tạo một số Canvas Texture dùng chung thay vì mỗi Mesh tạo 1 texture riêng biệt
  const textCache = {};
  function getOrCreateTextTexture(_0xa664bf) {
    if (textCache[_0xa664bf]) return textCache[_0xa664bf];
    
    const _0x1b21ad = document.createElement("canvas");
    const _0x31d6ac = _0x1b21ad.getContext('2d');
    let _0x28dfd9 = 96;
    _0x31d6ac.font = "bold " + _0x28dfd9 + "px 'Arial'";
    let _0x25d2e9 = _0x31d6ac.measureText(_0xa664bf).width;
    if (_0x25d2e9 + 200 > 1200) {
      _0x28dfd9 = Math.floor(_0x28dfd9 * 1000 / _0x25d2e9);
      _0x31d6ac.font = "bold " + _0x28dfd9 + "px 'Arial'";
      _0x25d2e9 = _0x31d6ac.measureText(_0xa664bf).width;
    }
    const _0x17d39f = Math.ceil(_0x25d2e9 + 200);
    const _0x3f5726 = document.createElement("canvas");
    _0x3f5726.width = _0x17d39f;
    _0x3f5726.height = 384;
    const _0x134356 = _0x3f5726.getContext('2d');
    _0x134356.font = "bold " + _0x28dfd9 + "px 'Arial'";
    _0x134356.textAlign = 'center';
    _0x134356.textBaseline = 'middle';
    _0x134356.shadowColor = '#ff69b4';
    _0x134356.shadowBlur = 50;
    _0x134356.fillStyle = "rgba(255, 255, 255, 0.8)";
    _0x134356.fillText(_0xa664bf, _0x3f5726.width / 2, _0x3f5726.height / 2);
    _0x134356.strokeStyle = '#fff';
    _0x134356.lineCap = "round";
    _0x134356.lineWidth = 2;
    _0x134356.strokeText(_0xa664bf, _0x3f5726.width / 2, _0x3f5726.height / 2);
    
    const tex = new THREE.CanvasTexture(_0x3f5726);
    tex.minFilter = THREE.LinearFilter; // Tối ưu bộ nhớ lọc ảnh
    
    textCache[_0xa664bf] = {
      'texture': tex,
      'aspect': _0x3f5726.width / _0x3f5726.height
    };
    return textCache[_0xa664bf];
  }

  function createHeartTexture(_0x48db3f) {
    const _0x1fb876 = document.createElement("canvas");
    _0x1fb876.width = 256;
    _0x1fb876.height = 256;
    const _0x533fe5 = _0x1fb876.getContext('2d');
    _0x533fe5.clearRect(0, 0, _0x1fb876.width, _0x1fb876.height);
    _0x533fe5.shadowColor = "#ff69b4";
    _0x533fe5.shadowBlur = 30;
    const _0x59fc14 = _0x1fb876.width / 2;
    const _0xbb8015 = _0x1fb876.height / 2;
    const _0x262653 = (_0x1fb876.width - _0x59fc14) / 2;
    const _0x5e8b66 = (_0x1fb876.height - _0xbb8015) / 2;
    _0x533fe5.drawImage(_0x48db3f, _0x262653, _0x5e8b66, _0x59fc14, _0xbb8015);
    const tex = new THREE.CanvasTexture(_0x1fb876);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  let starMeshes = [];
  function createStars() {
    const _0x50fe89 = new THREE.SphereGeometry(0.07, 4, 4); // Giảm segment xuống 4x4 để vẽ cực nhanh
    const _0x5001f8 = new THREE.MeshBasicMaterial({ 'color': 0xffffff });
    for (let _0x29c266 = 0; _0x29c266 < 400; _0x29c266++) {
      const _0x4b2101 = new THREE.Mesh(_0x50fe89, _0x5001f8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 60 + Math.random() * 20;
      _0x4b2101.position.x = dist * Math.sin(phi) * Math.cos(theta);
      _0x4b2101.position.y = dist * Math.sin(phi) * Math.sin(theta);
      _0x4b2101.position.z = dist * Math.cos(phi);
      
      _0x4b2101.matrixAutoUpdate = false; // Tắt tự động update ma trận vì sao đứng yên
      _0x4b2101.updateMatrix();
      scene.add(_0x4b2101);
      starMeshes.push(_0x4b2101);
    }
  }

  let textMeshes = [];
  function createFallingTexts() {
    textMeshes.forEach(_0x1a7b31 => scene.remove(_0x1a7b31));
    textMeshes = [];
    
    for (let _0x24b5af = 0; _0x24b5af < 400; _0x24b5af++) {
      const _0xa664bf = texts[Math.floor(Math.random() * texts.length)];
      const { texture: _0x1869cf, aspect: _0x5acdbd } = getOrCreateTextTexture(_0xa664bf);
      
      const _0x54dee9 = new THREE.PlaneGeometry(0.3 * _0x5acdbd, 3);
      const _0x4e41dd = new THREE.MeshBasicMaterial({
        'map': _0x1869cf,
        'transparent': true,
        'depthWrite': true,
        'depthTest': true,
        'alphaTest': 0.3, // KHẮC PHỤC LỖI VỆT ĐEN HOÀN TOÀN
        'side': THREE.DoubleSide
      });
      const _0xe4de67 = new THREE.Mesh(_0x54dee9, _0x4e41dd);
      
      const angle = Math.random() * Math.PI * 2;
      const randomRadius = 1.5 + Math.random() * 33.5;
      
      _0xe4de67.position.x = Math.cos(angle) * randomRadius;
      _0xe4de67.position.y = (Math.random() - 0.5) * (randomRadius * 1.5); 
      _0xe4de67.position.z = Math.sin(angle) * randomRadius;
      
      if (randomRadius < 5) {
        const s = randomRadius / 5;
        _0xe4de67.scale.set(s, s, 1);
      }

      _0xe4de67.userData = {
        phase: Math.random() * Math.PI * 2,
        radius: randomRadius,
        speed: (0.02 + (randomRadius * 0.0005))
      };
      
      _0xe4de67.matrixAutoUpdate = false; // Tối ưu: Kiểm soát update ma trận thủ công
      _0xe4de67.updateMatrix();
      scene.add(_0xe4de67);
      textMeshes.push(_0xe4de67);
    }
  }

  let heartMeshes = [];
  function createFallingHearts(_0x379ef8) {
    heartMeshes.forEach(_0x141d1e => scene.remove(_0x141d1e));
    heartMeshes = [];
    const _0x36b57c = new THREE.PlaneGeometry(1, 1);
    
    for (let _0x96b054 = 0; _0x96b054 < 80; _0x96b054++) {
      const _0x5cee8f = new THREE.MeshBasicMaterial({
        'map': _0x379ef8,
        'transparent': true,
        'depthWrite': true,
        'depthTest': true,
        'alphaTest': 0.2, // KHẮC PHỤC LỖI VỆT ĐEN TRÁI TIM
        'side': THREE.DoubleSide
      });
      const _0x3b9b90 = new THREE.Mesh(_0x36b57c, _0x5cee8f);
      
      const angle = Math.random() * Math.PI * 2;
      const randomRadius = 1.0 + Math.random() * 34.0;
      
      _0x3b9b90.position.x = Math.cos(angle) * randomRadius;
      _0x3b9b90.position.y = (Math.random() - 0.5) * (randomRadius * 1.5);
      _0x3b9b90.position.z = Math.sin(angle) * randomRadius;
      
      const baseScale = 1.0 + Math.random() * 1.5;
      const distScale = randomRadius < 4 ? (randomRadius / 4) : 1;
      _0x3b9b90.scale.set(baseScale * distScale, baseScale * distScale, 1);
      
      _0x3b9b90.userData = { 
        radius: randomRadius,
        speed: (0.03 + (randomRadius * 0.0005))
      };
      
      _0x3b9b90.matrixAutoUpdate = false;
      _0x3b9b90.updateMatrix();
      scene.add(_0x3b9b90);
      heartMeshes.push(_0x3b9b90);
    }
  }

  let shootingStars = [];
  function spawnShootingStar() {
    const _0x1bccac = new THREE.SphereGeometry(0.15, 4, 4);
    const _0x5508fd = new THREE.MeshBasicMaterial({ 'color': 0xffffff, 'transparent': true });
    const _0xd3cfa5 = new THREE.Mesh(_0x1bccac, _0x5508fd);
    
    const angle = Math.random() * Math.PI * 2;
    _0xd3cfa5.position.x = Math.cos(angle) * 50;
    _0xd3cfa5.position.y = Math.random() * 30 + 10;
    _0xd3cfa5.position.z = Math.sin(angle) * 50;
    
    _0xd3cfa5.userData = {
      'vx': (Math.random() - 0.5) * 0.5,
      'vy': -0.3 - Math.random() * 0.2,
      'vz': (Math.random() - 0.5) * 0.5,
      'tail': []
    };
    scene.add(_0xd3cfa5);
    shootingStars.push(_0xd3cfa5);
  }

  let isDragging = false;
  let lastX = 0;
  let isTouching = false;
  let lastTouchX = 0;
  let targetRotationY = 0.5;

  renderer.domElement.addEventListener("mousedown", _0x15698c => {
    isDragging = true;
    lastX = _0x15698c.clientX;
  });
  window.addEventListener("mouseup", () => { isDragging = false; });
  window.addEventListener("mousemove", _0x12bba7 => {
    if (isDragging) {
      const _0x4ad287 = _0x12bba7.clientX - lastX;
      lastX = _0x12bba7.clientX;
      targetRotationY += _0x4ad287 * 0.003; 
    }
  });
  renderer.domElement.addEventListener("touchstart", _0x407186 => {
    if (_0x407186.touches.length === 1) {
      isTouching = true;
      lastTouchX = _0x407186.touches[0].clientX;
    }
  });
  window.addEventListener("touchend", () => { isTouching = false; });
  window.addEventListener("touchmove", _0x54fba1 => {
    if (isTouching && _0x54fba1.touches.length === 1) {
      const _0x1438b1 = _0x54fba1.touches[0].clientX;
      const _0x365625 = _0x1438b1 - lastTouchX;
      lastTouchX = _0x1438b1;
      targetRotationY += _0x365625 * 0.003;
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    
    // Cập nhật mượt góc quay camera
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.08;
    
    // TỐI ƯU CỐT LÕI: Tính toán không gian hiển thị của Camera hiện tại
    camera.updateMatrixWorld();
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    const _0x4b0f0b = Date.now();

    // Duyệt danh sách chữ rơi
    textMeshes.forEach(_0x2318e2 => {
      // 1. TÍNH CHUYỂN ĐỘNG TRƯỚC (Vì đối tượng vẫn rơi dù ở ngoài camera)
      _0x2318e2.position.y -= _0x2318e2.userData.speed;
      const boundY = _0x2318e2.userData.radius * 0.8;
      
      if (_0x2318e2.position.y < -boundY) {
        _0x2318e2.position.y = boundY;
        const newAngle = Math.random() * Math.PI * 2;
        const r = _0x2318e2.userData.radius;
        _0x2318e2.position.x = Math.cos(newAngle) * r;
        _0x2318e2.position.z = Math.sin(newAngle) * r;
      }

      // 2. CHỈ RENDER KHI NẰM TRONG FRUSTUM (LIA CAMERA QUA MỚI XỬ LÝ)
      if (frustum.intersectsMesh(_0x2318e2)) {
        _0x2318e2.visible = true; // Bật hiển thị
        _0x2318e2.lookAt(camera.position); // Quay mặt vào camera
        
        // Đổi màu Gradient nhấp nháy theo thời gian
        const _0x2fe3b8 = (Math.sin(_0x4b0f0b * 0.0005 + _0x2318e2.userData.phase) + 1) / 2;
        const _0x53cb76 = [
          Math.round(255 + (255 - 255) * _0x2fe3b8), 
          Math.round(255 + (105 - 255) * _0x2fe3b8), 
          Math.round(255 + (180 - 255) * _0x2fe3b8)
        ];
        _0x2318e2.material.color.setHex(_0x53cb76[0] << 16 | _0x53cb76[1] << 8 | _0x53cb76[2]);
        _0x2318e2.updateMatrix(); // Chỉ cập nhật ma trận đồ họa khi nằm trong camera nhìn thấy
      } else {
        _0x2318e2.visible = false; // Tắt hẳn việc render mesh ngoài camera
      }
    });

    // Duyệt danh sách trái tim rơi
    heartMeshes.forEach(_0x54dfd5 => {
      _0x54dfd5.position.y -= _0x54dfd5.userData.speed;
      const boundY = _0x54dfd5.userData.radius * 0.8;
      
      if (_0x54dfd5.position.y < -boundY) {
        _0x54dfd5.position.y = boundY;
        const newAngle = Math.random() * Math.PI * 2;
        const r = _0x54dfd5.userData.radius;
        _0x54dfd5.position.x = Math.cos(newAngle) * r;
        _0x54dfd5.position.z = Math.sin(newAngle) * r;
      }

      // CHỈ RENDER TIM KHI LIA QUA KÍNH CAMERA
      if (frustum.intersectsMesh(_0x54dfd5)) {
        _0x54dfd5.visible = true;
        _0x54dfd5.lookAt(camera.position);
        _0x54dfd5.updateMatrix();
      } else {
        _0x54dfd5.visible = false;
      }
    });

    // Xử lý sao băng nền
    shootingStars.forEach((_0x49e829, _0x135e8f) => {
      _0x49e829.position.x += _0x49e829.userData.vx;
      _0x49e829.position.y += _0x49e829.userData.vy;
      _0x49e829.position.z += _0x49e829.userData.vz;
      
      const distFromCenter = Math.sqrt(_0x49e829.position.x**2 + _0x49e829.position.y**2 + _0x49e829.position.z**2);
      if (distFromCenter > 80 || _0x49e829.position.y < -30) {
        scene.remove(_0x49e829);
        shootingStars.splice(_0x135e8f, 1);
      }
    });

    if (Math.random() < 0.01) {
      spawnShootingStar();
    }
    
    renderer.render(scene, camera);
  }

  createStars();
  createFallingTexts();
  loadHeartImage('./heart.png').then(_0x430c12 => {
    const _0x7aa84d = createHeartTexture(_0x430c12);
    createFallingHearts(_0x7aa84d);
    animate();
  });

  window.addEventListener("resize", () => {
    const _0x25bfeb = window.innerWidth;
    const _0x43bec5 = window.innerHeight;
    camera.aspect = _0x25bfeb / _0x43bec5;
    camera.updateProjectionMatrix();
    renderer.setSize(_0x25bfeb, _0x43bec5);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
