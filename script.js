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
  const camera = new THREE.PerspectiveCamera(0x4b, width / height, 0.1, 0x3e8);
  const renderer = new THREE.WebGLRenderer({
    'alpha': true
  });
  renderer.setSize(width, height);
  document.getElementById("threejs-canvas").appendChild(renderer.domElement);
  
  camera.position.set(0, 0, 0);
  camera.rotation.y = 0.5;

  const radius = 25; 

  renderer.domElement.addEventListener("wheel", _0x1f6767 => {
    _0x1f6767.preventDefault();
    camera.fov += _0x1f6767.deltaY * 0.05;
    camera.fov = Math.max(30, Math.min(camera.fov, 90));
    camera.updateProjectionMatrix();
  });

  function createTextTexture(_0x8a7755) {
    const _0x1b21ad = document.createElement("canvas");
    const _0x31d6ac = _0x1b21ad.getContext('2d');
    let _0x28dfd9 = 0x60;
    _0x31d6ac.font = "bold " + _0x28dfd9 + "px 'Arial'";
    let _0x25d2e9 = _0x31d6ac.measureText(_0x8a7755).width;
    if (_0x25d2e9 + 200 > 0x4b0) {
      _0x28dfd9 = Math.floor(_0x28dfd9 * 1000 / _0x25d2e9);
      _0x31d6ac.font = "bold " + _0x28dfd9 + "px 'Arial'";
      _0x25d2e9 = _0x31d6ac.measureText(_0x8a7755).width;
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
    _0x134356.shadowBlur = 0x32;
    _0x134356.fillStyle = "rgba(255, 255, 255, 0.8)";
    _0x134356.fillText(_0x8a7755, _0x3f5726.width / 0x2, _0x3f5726.height / 0x2);
    _0x134356.strokeStyle = '#fff';
    _0x134356.lineCap = "round";
    _0x134356.lineWidth = 0x2;
    _0x134356.strokeText(_0x8a7755, _0x3f5726.width / 0x2, _0x3f5726.height / 0x2);
    return {
      'texture': new THREE.CanvasTexture(_0x3f5726),
      'aspect': _0x3f5726.width / _0x3f5726.height
    };
  }

  function createHeartTexture(_0x48db3f) {
    const _0x1fb876 = document.createElement("canvas");
    _0x1fb876.width = 256;
    _0x1fb876.height = 256;
    const _0x533fe5 = _0x1fb876.getContext('2d');
    _0x533fe5.clearRect(0x0, 0x0, _0x1fb876.width, _0x1fb876.height);
    _0x533fe5.shadowColor = "#ff69b4";
    _0x533fe5.shadowBlur = 0x1e;
    const _0x59fc14 = _0x1fb876.width / 0x2;
    const _0xbb8015 = _0x1fb876.height / 0x2;
    const _0x262653 = (_0x1fb876.width - _0x59fc14) / 0x2;
    const _0x5e8b66 = (_0x1fb876.height - _0xbb8015) / 0x2;
    _0x533fe5.drawImage(_0x48db3f, _0x262653, _0x5e8b66, _0x59fc14, _0xbb8015);
    return new THREE.CanvasTexture(_0x1fb876);
  }

  let starMeshes = [];
  function createStars() {
    const _0x50fe89 = new THREE.SphereGeometry(0.07, 0x6, 0x6);
    const _0x5001f8 = new THREE.MeshBasicMaterial({
      'color': 0xffffff
    });
    for (let _0x29c266 = 0x0; _0x29c266 < 0x320; _0x29c266++) {
      const _0x4b2101 = new THREE.Mesh(_0x50fe89, _0x5001f8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 50 + Math.random() * 20;
      _0x4b2101.position.x = dist * Math.sin(phi) * Math.cos(theta);
      _0x4b2101.position.y = dist * Math.sin(phi) * Math.sin(theta);
      _0x4b2101.position.z = dist * Math.cos(phi);
      scene.add(_0x4b2101);
      starMeshes.push(_0x4b2101);
    }
  }

  let textMeshes = [];
  function createFallingTexts() {
    textMeshes.forEach(_0x1a7b31 => scene.remove(_0x1a7b31));
    textMeshes = [];
    
    // TĂNG LÊN: Thay vì 200 (0xc8), tăng lên 350 để chữ dày đặc khắp nơi
    for (let _0x24b5af = 0x0; _0x24b5af < 350; _0x24b5af++) {
      const _0xa664bf = texts[Math.floor(Math.random() * texts.length)];
      const {
        texture: _0x1869cf,
        aspect: _0x5acdbd
      } = createTextTexture(_0xa664bf);
      _0x1869cf.needsUpdate = true;
      const _0x49c73a = 0x3 * _0x5acdbd;
      const _0x54dee9 = new THREE.PlaneGeometry(_0x49c73a, 0x3);
      const _0x4e41dd = new THREE.MeshBasicMaterial({
        'map': _0x1869cf,
        'transparent': true,
        'depthWrite': false,
        'depthTest': true,
        'color': 0xffffff,
        'side': THREE.DoubleSide
      });
      const _0xe4de67 = new THREE.Mesh(_0x54dee9, _0x4e41dd);
      
      const angle = Math.random() * Math.PI * 2;
      // Thêm một chút random bán kính để chữ đứng so le dày sâu/nông khác nhau
      const randomRadius = radius + (Math.random() - 0.5) * 6;
      _0xe4de67.position.x = Math.cos(angle) * randomRadius;
      _0xe4de67.position.y = Math.random() * 50 - 25; // Nới rộng tầm rơi Y để phân bố đều
      _0xe4de67.position.z = Math.sin(angle) * randomRadius;
      
      _0xe4de67.userData = {
        phase: Math.random() * Math.PI * 0x2,
        angle: angle 
      };
      scene.add(_0xe4de67);
      textMeshes.push(_0xe4de67);
    }
  }

  let heartMeshes = [];
  function createFallingHearts(_0x379ef8) {
    heartMeshes.forEach(_0x141d1e => scene.remove(_0x141d1e));
    heartMeshes = [];
    
    // TĂNG LÊN: Thay vì 15 (0xf), tăng lên 60 trái tim bay xung quanh
    for (let _0x96b054 = 0x0; _0x96b054 < 60; _0x96b054++) {
      const _0x36b57c = new THREE.PlaneGeometry(0x1, 0x1);
      const _0x5cee8f = new THREE.MeshBasicMaterial({
        'map': _0x379ef8,
        'transparent': true,
        'depthWrite': false,
        'depthTest': true,
        'side': THREE.DoubleSide
      });
      const _0x3b9b90 = new THREE.Mesh(_0x36b57c, _0x5cee8f);
      
      const angle = Math.random() * Math.PI * 2;
      const randomRadius = (radius - 2) + (Math.random() - 0.5) * 8;
      _0x3b9b90.position.x = Math.cos(angle) * randomRadius;
      _0x3b9b90.position.y = Math.random() * 50 - 25;
      _0x3b9b90.position.z = Math.sin(angle) * randomRadius;
      
      const _0x582ecb = 1.0 + Math.random() * 1.5;
      _0x3b9b90.scale.set(_0x582ecb, _0x582ecb, 0x1);
      _0x3b9b90.userData = { angle: angle };
      scene.add(_0x3b9b90);
      heartMeshes.push(_0x3b9b90);
    }
  }

  let shootingStars = [];
  function spawnShootingStar() {
    const _0x1bccac = new THREE.SphereGeometry(0.15, 0x8, 0x8);
    const _0x5508fd = new THREE.MeshBasicMaterial({
      'color': 0xffffff,
      'transparent': true
    });
    const _0xd3cfa5 = new THREE.Mesh(_0x1bccac, _0x5508fd);
    
    const angle = Math.random() * Math.PI * 2;
    _0xd3cfa5.position.x = Math.cos(angle) * 40;
    _0xd3cfa5.position.y = Math.random() * 30 + 10;
    _0xd3cfa5.position.z = Math.sin(angle) * 40;
    
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
  let lastX = 0x0;
  let isTouching = false;
  let lastTouchX = 0x0;
  let targetRotationY = 0.5;

  renderer.domElement.addEventListener("mousedown", _0x15698c => {
    isDragging = true;
    lastX = _0x15698c.clientX;
  });
  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
  window.addEventListener("mousemove", _0x12bba7 => {
    if (isDragging) {
      const _0x4ad287 = _0x12bba7.clientX - lastX;
      lastX = _0x12bba7.clientX;
      targetRotationY += _0x4ad287 * 0.003; 
    }
  });
  renderer.domElement.addEventListener("touchstart", _0x407186 => {
    if (_0x407186.touches.length === 0x1) {
      isTouching = true;
      lastTouchX = _0x407186.touches[0x0].clientX;
    }
  });
  window.addEventListener("touchend", () => {
    isTouching = false;
  });
  window.addEventListener("touchmove", _0x54fba1 => {
    if (isTouching && _0x54fba1.touches.length === 0x1) {
      const _0x1438b1 = _0x54fba1.touches[0x0].clientX;
      const _0x365625 = _0x1438b1 - lastTouchX;
      lastTouchX = _0x1438b1;
      targetRotationY += _0x365625 * 0.003;
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.08;
    const _0x4b0f0b = Date.now();

    textMeshes.forEach(_0x2318e2 => {
      _0x2318e2.lookAt(camera.position); 
      _0x2318e2.position.y -= 0.025 + Math.random() * 0.005;
      
      if (_0x2318e2.position.y < -20) {
        _0x2318e2.position.y = Math.random() * 15 + 20;
        const newAngle = Math.random() * Math.PI * 2;
        const randomRadius = radius + (Math.random() - 0.5) * 6;
        _0x2318e2.position.x = Math.cos(newAngle) * randomRadius;
        _0x2318e2.position.z = Math.sin(newAngle) * randomRadius;
      }

      const _0x2fe3b8 = (Math.sin(_0x4b0f0b * 0.0005 + _0x2318e2.userData.phase) + 0x1) / 0x2;
      const _0x53cb76 = [Math.round([0xff, 0xff, 0xff][0x0] + ([0xff, 0x69, 0xb4][0x0] - [0xff, 0xff, 0xff][0x0]) * _0x2fe3b8), Math.round([0xff, 0xff, 0xff][0x1] + ([0xff, 0x69, 0xb4][0x1] - [0xff, 0xff, 0xff][0x1]) * _0x2fe3b8), Math.round([0xff, 0xff, 0xff][0x2] + ([0xff, 0x69, 0xb4][0x2] - [0xff, 0xff, 0xff][0x2]) * _0x2fe3b8)];
      const _0x3a56ee = _0x53cb76[0x0] << 0x10 | _0x53cb76[0x1] << 0x8 | _0x53cb76[0x2];
      _0x2318e2.material.color.setHex(_0x3a56ee);
    });

    heartMeshes.forEach(_0x54dfd5 => {
      _0x54dfd5.lookAt(camera.position);
      _0x54dfd5.position.y -= 0.04 + Math.random() * 0.02;
      
      if (_0x54dfd5.position.y < -20) {
        _0x54dfd5.position.y = Math.random() * 15 + 20;
        const newAngle = Math.random() * Math.PI * 2;
        const randomRadius = (radius - 2) + (Math.random() - 0.5) * 8;
        _0x54dfd5.position.x = Math.cos(newAngle) * randomRadius;
        _0x54dfd5.position.z = Math.sin(newAngle) * randomRadius;
      }
    });

    shootingStars.forEach((_0x49e829, _0x135e8f) => {
      if (_0x49e829.userData.tail.length > 0x14) {
        _0x49e829.userData.tail.shift();
      }
      _0x49e829.userData.tail.push({
        'x': _0x49e829.position.x,
        'y': _0x49e829.position.y,
        'z': _0x49e829.position.z
      });
      _0x49e829.position.x += _0x49e829.userData.vx;
      _0x49e829.position.y += _0x49e829.userData.vy;
      _0x49e829.position.z += _0x49e829.userData.vz;

      for (let _0x48cf49 = 0x0; _0x48cf49 < _0x49e829.userData.tail.length - 0x1; _0x48cf49++) {
        const _0x5561f6 = _0x49e829.userData.tail[_0x48cf49];
        const _0x3f58a1 = _0x49e829.userData.tail[_0x48cf49 + 0x1];
        const _0x3b31b7 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(_0x5561f6.x, _0x5561f6.y, _0x5561f6.z), new THREE.Vector3(_0x3f58a1.x, _0x3f58a1.y, _0x3f58a1.z)]);
        const _0x2e431b = new THREE.LineBasicMaterial({
          'color': 0xffffff,
          'transparent': true,
          'opacity': 0.15 + 0.25 * (_0x48cf49 / _0x49e829.userData.tail.length)
        });
        const _0x14625f = new THREE.Line(_0x3b31b7, _0x2e431b);
        scene.add(_0x14625f);
        setTimeout(() => scene.remove(_0x14625f), 0x28);
      }
      _0x49e829.material.opacity = 0.8;
      
      const distFromCenter = Math.sqrt(_0x49e829.position.x**2 + _0x49e829.position.y**2 + _0x49e829.position.z**2);
      if (distFromCenter > 70 || _0x49e829.position.y < -30) {
        scene.remove(_0x49e829);
        shootingStars.splice(_0x135e8f, 0x1);
      }
    });

    if (Math.random() < 0.012) {
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
  });
