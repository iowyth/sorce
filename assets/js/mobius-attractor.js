/**
 * Möbius-Klein Attractor Animation
 * Faithfully ported from Python matplotlib to Three.js
 */

(function() {
  function init() {
    const container = document.getElementById('mobius-container');
    if (!container) return;

    const width = container.offsetWidth || 800;
    const height = container.offsetHeight || 300;

    if (width === 0 || height === 0) {
      setTimeout(init, 100);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Parameters matching Python exactly
    const numTracers = 200;
    const trailLength = 50;
    const R = 2.0;
    const r = 0.7;

    // Pre-compute u and v arrays (like numpy linspace)
    const uArr = new Float32Array(numTracers);
    const vArr = new Float32Array(numTracers);
    for (let i = 0; i < numTracers; i++) {
      uArr[i] = (i / (numTracers - 1)) * 2 * Math.PI;
      vArr[i] = (i / (numTracers - 1)) * 2 * Math.PI;
    }

    // Trail buffers
    const trailX = [];
    const trailY = [];
    const trailZ = [];
    for (let t = 0; t < trailLength; t++) {
      trailX.push(new Float32Array(numTracers));
      trailY.push(new Float32Array(numTracers));
      trailZ.push(new Float32Array(numTracers));
    }

    // Dynamic time scaling state
    let globalEffectiveT = 0;
    const baseDt = 0.25;  // Slower animation
    const alphaSpeed = 0.1;
    const betaDt = 0.3;
    let prevDt = baseDt;
    let prevPoints = new Float32Array(numTracers * 3);

    // Quaternion state
    let globalQPrev = [0, 0, 0, 1];

    // Quaternion math helpers
    function normalizeQuat(q) {
      const len = Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2] + q[3]*q[3]);
      return [q[0]/len, q[1]/len, q[2]/len, q[3]/len];
    }

    function slerpQuat(qa, qb, t) {
      let dot = qa[0]*qb[0] + qa[1]*qb[1] + qa[2]*qb[2] + qa[3]*qb[3];
      if (dot < 0) {
        qb = [-qb[0], -qb[1], -qb[2], -qb[3]];
        dot = -dot;
      }
      if (dot > 0.9995) {
        return normalizeQuat([
          qa[0] + t*(qb[0]-qa[0]),
          qa[1] + t*(qb[1]-qa[1]),
          qa[2] + t*(qb[2]-qa[2]),
          qa[3] + t*(qb[3]-qa[3])
        ]);
      }
      const theta0 = Math.acos(dot);
      const theta = theta0 * t;
      const sinTheta = Math.sin(theta);
      const sinTheta0 = Math.sin(theta0);
      const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
      const s1 = sinTheta / sinTheta0;
      return [
        s0*qa[0] + s1*qb[0],
        s0*qa[1] + s1*qb[1],
        s0*qa[2] + s1*qb[2],
        s0*qa[3] + s1*qb[3]
      ];
    }

    function applyQuat(q, x, y, z) {
      // Apply quaternion rotation to point
      const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
      const ix = qw*x + qy*z - qz*y;
      const iy = qw*y + qz*x - qx*z;
      const iz = qw*z + qx*y - qy*x;
      const iw = -qx*x - qy*y - qz*z;
      return [
        ix*qw + iw*(-qx) + iy*(-qz) - iz*(-qy),
        iy*qw + iw*(-qy) + iz*(-qx) - ix*(-qz),
        iz*qw + iw*(-qz) + ix*(-qy) - iy*(-qx)
      ];
    }

    // Möbius-Klein attractor - exact port from Python
    function mobiusKleinAttractor(t, quat, outX, outY, outZ) {
      const plasmaT1 = Math.sin(t * 0.02);
      const plasmaT2 = Math.cos(t * 0.02);

      for (let i = 0; i < numTracers; i++) {
        const u = uArr[i];
        const v = vArr[i];

        // Klein and Möbius recursion components
        const kleinFactor = Math.cos(u) * Math.sin(v);
        const mobiusFactor = Math.sin(u/2 + v/2) * kleinFactor;

        // Base coordinates
        let x = (R + r * kleinFactor + plasmaT1 * 0.5) * Math.cos(u);
        let y = (R + r * kleinFactor + plasmaT1 * 0.5) * Math.sin(u);
        let z = (r * Math.sin(u/2) + plasmaT2 * 0.3) * Math.cos(v);

        // Higher-dimensional recursive folding
        const phi = Math.sin(v * 4 + plasmaT1 * 0.7) * mobiusFactor;
        const theta = Math.cos(u * 3 + plasmaT2 * 0.3) * mobiusFactor;
        const omega = Math.sin(v * 2 + plasmaT1 * 0.5) * mobiusFactor;

        const fastScale = 0.3;
        let bx = x + Math.sin(t * 0.1 + phi) * fastScale;
        let by = y + Math.cos(t * 0.1 + theta) * fastScale;
        let bz = z + Math.sin(t * 0.1 + omega) * fastScale;

        // Apply quaternion rotation
        const rotated = applyQuat(quat, bx, by, bz);
        outX[i] = rotated[0];
        outY[i] = rotated[1];
        outZ[i] = rotated[2];
      }
    }

    // Initialize with identity quaternion
    const initQuat = [0, 0, 0, 1];
    const tempX = new Float32Array(numTracers);
    const tempY = new Float32Array(numTracers);
    const tempZ = new Float32Array(numTracers);

    mobiusKleinAttractor(0, initQuat, tempX, tempY, tempZ);

    for (let t = 0; t < trailLength; t++) {
      for (let i = 0; i < numTracers; i++) {
        trailX[t][i] = tempX[i];
        trailY[t][i] = tempY[i];
        trailZ[t][i] = tempZ[i];
      }
    }
    for (let i = 0; i < numTracers; i++) {
      prevPoints[i*3] = tempX[i];
      prevPoints[i*3+1] = tempY[i];
      prevPoints[i*3+2] = tempZ[i];
    }

    // Create geometry
    const totalPoints = trailLength * numTracers;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Simple point material with vertex colors
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;

    function siteColormap(t) {
      // Site colors: lavender (#DDCFFF) -> blue (#040DE1) -> dark (#1a1a1a)
      let r, g, b;
      if (t < 0.5) {
        // Lavender to Blue
        const s = t * 2;
        r = 0.867 * (1 - s) + 0.016 * s;  // DD -> 04
        g = 0.812 * (1 - s) + 0.051 * s;  // CF -> 0D
        b = 1.0 * (1 - s) + 0.882 * s;    // FF -> E1
      } else {
        // Blue to Dark
        const s = (t - 0.5) * 2;
        r = 0.016 * (1 - s) + 0.1 * s;    // 04 -> 1a
        g = 0.051 * (1 - s) + 0.1 * s;    // 0D -> 1a
        b = 0.882 * (1 - s) + 0.1 * s;    // E1 -> 1a
      }
      return [r, g, b];
    }

    function update() {
      frame++;

      // Compute candidate quaternion (matching Python exactly)
      const qCandidate = normalizeQuat([
        Math.sin(frame * 0.01),
        Math.cos(frame * 0.01),
        Math.sin(frame * 0.005),
        1
      ]);

      // SLERP with t=0.2
      const qInterp = slerpQuat(globalQPrev, qCandidate, 0.2);
      globalQPrev = qInterp;

      // Compute new positions
      mobiusKleinAttractor(globalEffectiveT, qInterp, tempX, tempY, tempZ);

      // Dynamic time scaling
      let totalDisp = 0;
      for (let i = 0; i < numTracers; i++) {
        const dx = tempX[i] - prevPoints[i*3];
        const dy = tempY[i] - prevPoints[i*3+1];
        const dz = tempZ[i] - prevPoints[i*3+2];
        totalDisp += Math.sqrt(dx*dx + dy*dy + dz*dz);
      }
      const avgSpeed = totalDisp / numTracers;
      const newDt = baseDt / (1 + alphaSpeed * avgSpeed);
      const dt = (1 - betaDt) * prevDt + betaDt * newDt;
      prevDt = dt;
      globalEffectiveT += dt;

      // Update prev points
      for (let i = 0; i < numTracers; i++) {
        prevPoints[i*3] = tempX[i];
        prevPoints[i*3+1] = tempY[i];
        prevPoints[i*3+2] = tempZ[i];
      }

      // Shift trails
      const oldX = trailX.shift();
      const oldY = trailY.shift();
      const oldZ = trailZ.shift();
      for (let i = 0; i < numTracers; i++) {
        oldX[i] = tempX[i];
        oldY[i] = tempY[i];
        oldZ[i] = tempZ[i];
      }
      trailX.push(oldX);
      trailY.push(oldY);
      trailZ.push(oldZ);

      // Update geometry
      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.color;

      // Find z range
      let zMin = Infinity, zMax = -Infinity;
      for (let t = 0; t < trailLength; t++) {
        for (let i = 0; i < numTracers; i++) {
          const z = trailZ[t][i];
          if (z < zMin) zMin = z;
          if (z > zMax) zMax = z;
        }
      }
      const zRange = zMax - zMin + 0.001;

      let idx = 0;
      for (let t = 0; t < trailLength; t++) {
        // Trail fade: keep colors bright, just reduce slightly for older points
        const trailFade = 0.4 + 0.6 * ((t + 1) / trailLength);
        for (let i = 0; i < numTracers; i++) {
          posAttr.array[idx*3] = trailX[t][i];
          posAttr.array[idx*3+1] = trailY[t][i];
          posAttr.array[idx*3+2] = trailZ[t][i];

          const zNorm = (trailZ[t][i] - zMin) / zRange;
          const [r, g, b] = siteColormap(zNorm);

          // Keep colors vibrant, minimal fade
          colAttr.array[idx*3] = r * trailFade;
          colAttr.array[idx*3+1] = g * trailFade;
          colAttr.array[idx*3+2] = b * trailFade;

          idx++;
        }
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    function animate() {
      requestAnimationFrame(animate);
      update();
      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function onResize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }
    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
