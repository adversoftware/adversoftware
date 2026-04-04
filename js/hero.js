/* ============================================
   adver.software — Three.js Hero Scene
   Glass refraction objects in void
   ============================================ */

(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* Lights — three colored point lights matching accent palette */
  const lightGreen1 = new THREE.PointLight(0x3dff7a, 1.5, 30);
  lightGreen1.position.set(-4, 3, 4);
  scene.add(lightGreen1);

  const lightGreen2 = new THREE.PointLight(0x22c55e, 1.5, 30);
  lightGreen2.position.set(4, -2, 3);
  scene.add(lightGreen2);

  const lightTeal = new THREE.PointLight(0x7affa3, 1, 30);
  lightTeal.position.set(0, 4, -3);
  scene.add(lightTeal);

  const ambient = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(ambient);

  /* Create glass-like objects */
  const glassMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.12,
    shininess: 200,
    specular: 0x3dff7a,
    side: THREE.DoubleSide,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x3dff7a,
    transparent: true,
    opacity: 0.25,
  });

  const geometries = [
    new THREE.IcosahedronGeometry(0.9, 0),
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.TorusGeometry(0.6, 0.2, 8, 24),
    new THREE.TetrahedronGeometry(0.8, 0),
    new THREE.DodecahedronGeometry(0.6, 0),
    new THREE.SphereGeometry(0.5, 16, 12),
    new THREE.TorusKnotGeometry(0.4, 0.15, 48, 8),
  ];

  const objects = [];
  const positions = [
    [-3.5, 1.5, -2],
    [3, 2, -3],
    [-1.5, -2, -1],
    [2.5, -1.5, -2.5],
    [0.5, 3, -4],
    [-3, -1, -3.5],
    [1, -3, -1.5],
  ];

  geometries.forEach((geo, i) => {
    const mat = glassMaterial.clone();
    mat.opacity = 0.08 + Math.random() * 0.08;

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...positions[i]);

    /* Edge wireframe for the glass look */
    const edges = new THREE.EdgesGeometry(geo);
    const edgeMat = edgeMaterial.clone();
    edgeMat.opacity = 0.15 + Math.random() * 0.15;
    const wireframe = new THREE.LineSegments(edges, edgeMat);
    mesh.add(wireframe);

    /* Random rotation speeds */
    mesh.userData = {
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.002,
      },
      basePos: { x: positions[i][0], y: positions[i][1], z: positions[i][2] },
      floatOffset: Math.random() * Math.PI * 2,
    };

    scene.add(mesh);
    objects.push(mesh);
  });

  /* Mouse tracking for subtle parallax */
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* Animation loop */
  function animate() {
    requestAnimationFrame(animate);

    /* Smooth mouse follow */
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;

    const time = Date.now() * 0.001;

    objects.forEach((obj) => {
      const { rotSpeed, basePos, floatOffset } = obj.userData;

      /* Slow rotation */
      obj.rotation.x += rotSpeed.x;
      obj.rotation.y += rotSpeed.y;
      obj.rotation.z += rotSpeed.z;

      /* Gentle floating */
      obj.position.y = basePos.y + Math.sin(time * 0.5 + floatOffset) * 0.3;

      /* Mouse parallax — objects move opposite to cursor */
      obj.position.x = basePos.x - mouseX * 0.3 * (1 + basePos.z * 0.1);
      obj.position.y += -mouseY * 0.2 * (1 + basePos.z * 0.1);
    });

    /* Subtle light movement */
    lightGreen1.position.x = -4 + Math.sin(time * 0.3) * 1;
    lightGreen2.position.y = -2 + Math.cos(time * 0.4) * 1;
    lightTeal.position.z = -3 + Math.sin(time * 0.2) * 1.5;

    renderer.render(scene, camera);
  }

  animate();

  /* Resize handler */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
