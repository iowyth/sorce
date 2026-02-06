/**
 * Möbius-Klein Attractor Animation
 * Ported from Python matplotlib to Three.js for web
 */

(function() {
  // Only run on home page
  const container = document.getElementById('mobius-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Color mapping function (blue -> yellow -> red based on z)
  function getColor(z, zMin, zMax) {
    const t = (z - zMin) / (zMax - zMin);

    // Blue (0) -> Yellow (0.5) -> Red (1)
    let r, g, b;
    if (t < 0.5) {
      // Blue to Yellow
      const s = t * 2;
      r = s;
      g = s;
      b = 1 - s;
    } else {
      // Yellow to Red
      const s = (t - 0.5) * 2;
      r = 1;
      g = 1 - s;
      b = 0;
    }

    return new THREE.Color(r, g, b);
  }

  // Möbius-Klein attractor parameters
  const a = 2.0;
  const b = 0.5;
  const c = 1.0;
  const d = 0.3;

  // Generate attractor points
  const numPoints = 5000;
  const positions = [];
  const colors = [];

  // Initial point
  let x = 0.1, y = 0.1, z = 0.1;
  const dt = 0.002;

  // Skip transient
  for (let i = 0; i < 1000; i++) {
    const dx = a * (y - x) + d * x * z;
    const dy = b * x - y - x * z;
    const dz = c * z + x * y - 0.1 * z * z * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }

  // Collect points
  let minZ = Infinity, maxZ = -Infinity;
  const rawPoints = [];

  for (let i = 0; i < numPoints; i++) {
    const dx = a * (y - x) + d * x * z;
    const dy = b * x - y - x * z;
    const dz = c * z + x * y - 0.1 * z * z * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    rawPoints.push({ x, y, z });
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  // Scale and center
  let sumX = 0, sumY = 0, sumZ = 0;
  rawPoints.forEach(p => {
    sumX += p.x;
    sumY += p.y;
    sumZ += p.z;
  });
  const centerX = sumX / numPoints;
  const centerY = sumY / numPoints;
  const centerZ = sumZ / numPoints;

  let maxDist = 0;
  rawPoints.forEach(p => {
    const d = Math.sqrt(
      Math.pow(p.x - centerX, 2) +
      Math.pow(p.y - centerY, 2) +
      Math.pow(p.z - centerZ, 2)
    );
    maxDist = Math.max(maxDist, d);
  });

  const scale = 1.5 / maxDist;

  rawPoints.forEach((p, i) => {
    const px = (p.x - centerX) * scale;
    const py = (p.y - centerY) * scale;
    const pz = (p.z - centerZ) * scale;

    positions.push(px, py, pz);

    const color = getColor(p.z, minZ, maxZ);
    colors.push(color.r, color.g, color.b);
  });

  // Create points geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // Point material with vertex colors
  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Trail effect - create multiple slightly rotated copies with decreasing opacity
  const trailCount = 5;
  const trails = [];

  for (let i = 1; i <= trailCount; i++) {
    const trailGeometry = geometry.clone();
    const trailMaterial = new THREE.PointsMaterial({
      size: 0.015 - i * 0.002,
      vertexColors: true,
      transparent: true,
      opacity: 0.6 - i * 0.1,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const trail = new THREE.Points(trailGeometry, trailMaterial);
    trails.push(trail);
    scene.add(trail);
  }

  // Quaternion rotation setup for smooth animation
  const targetQuaternion = new THREE.Quaternion();
  const currentQuaternion = new THREE.Quaternion();
  let time = 0;
  let nextTargetTime = 0;
  const targetDuration = 8; // seconds between new targets

  function generateRandomQuaternion() {
    const axis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Quaternion().setFromAxisAngle(axis, angle);
  }

  let startQuaternion = new THREE.Quaternion();
  targetQuaternion.copy(generateRandomQuaternion());

  // Animation loop
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    time += delta;

    // Update target quaternion periodically
    if (time >= nextTargetTime) {
      startQuaternion.copy(currentQuaternion);
      targetQuaternion.copy(generateRandomQuaternion());
      nextTargetTime = time + targetDuration;
    }

    // SLERP interpolation for smooth rotation
    const t = Math.min((time - (nextTargetTime - targetDuration)) / targetDuration, 1);
    const easeT = t * t * (3 - 2 * t); // Smoothstep easing
    currentQuaternion.slerpQuaternions(startQuaternion, targetQuaternion, easeT);

    // Apply rotation to main points
    points.quaternion.copy(currentQuaternion);

    // Apply slightly delayed rotations to trails
    trails.forEach((trail, i) => {
      const trailT = Math.max(0, easeT - (i + 1) * 0.05);
      const trailQuat = new THREE.Quaternion();
      trailQuat.slerpQuaternions(startQuaternion, targetQuaternion, trailT);
      trail.quaternion.copy(trailQuat);
    });

    // Subtle continuous rotation
    const slowRotation = new THREE.Quaternion();
    slowRotation.setFromEuler(new THREE.Euler(
      Math.sin(time * 0.1) * 0.001,
      delta * 0.2,
      Math.cos(time * 0.15) * 0.001
    ));

    points.quaternion.multiply(slowRotation);
    trails.forEach(trail => trail.quaternion.multiply(slowRotation));

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  function onResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize);

  // Cleanup on page navigation (for SPAs)
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', onResize);
    geometry.dispose();
    material.dispose();
    trails.forEach(t => {
      t.geometry.dispose();
      t.material.dispose();
    });
    renderer.dispose();
  });
})();
