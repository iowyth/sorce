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

    // Check WebGL
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Parameters matching Python
    const numTracers = 200;
    const trailLength = 50;
    const R = 2.0;
    const r = 0.7;

    // Trail buffers [trailLength][numTracers]
    let trailX = [];
    let trailY = [];
    let trailZ = [];
    for (let i = 0; i < trailLength; i++) {
      trailX.push(new Float32Array(numTracers));
      trailY.push(new Float32Array(numTracers));
      trailZ.push(new Float32Array(numTracers));
    }

    // Dynamic time scaling state
    let globalEffectiveT = 0;
    const baseDt = 0.5;
    const alphaSpeed = 0.1;
    const betaDt = 0.3;
    let prevDt = baseDt;
    let prevPoints = null;

    // Quaternion state for SLERP
    let globalQPrev = new THREE.Quaternion(0, 0, 0, 1);

    // Blue-Yellow-Red colormap
    function blueYellowRed(t) {
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
      return { r, g, b };
    }

    // Möbius-Klein attractor function matching Python
    function mobiusKleinAttractor(t, quaternion) {
      const positions = [];

      const plasmaT1 = Math.sin(t * 0.02);
      const plasmaT2 = Math.cos(t * 0.02);

      for (let i = 0; i < numTracers; i++) {
        const u = (i / numTracers) * 2 * Math.PI;
        const v = (i / numTracers) * 2 * Math.PI;

        // Klein and Möbius recursion components
        const kleinFactor = Math.cos(u) * Math.sin(v);
        const mobiusFactor = Math.sin(u/2 + v/2) * kleinFactor;

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

        positions.push({ x: bx, y: by, z: bz });
      }

      // Apply quaternion rotation
      if (quaternion) {
        const rotatedPositions = positions.map(p => {
          const vec = new THREE.Vector3(p.x, p.y, p.z);
          vec.applyQuaternion(quaternion);
          return { x: vec.x, y: vec.y, z: vec.z };
        });
        return rotatedPositions;
      }

      return positions;
    }

    // Initialize trails with starting positions
    const initQuat = new THREE.Quaternion(0, 0, 0, 1);
    const initPositions = mobiusKleinAttractor(0, initQuat);
    for (let t = 0; t < trailLength; t++) {
      for (let i = 0; i < numTracers; i++) {
        trailX[t][i] = initPositions[i].x;
        trailY[t][i] = initPositions[i].y;
        trailZ[t][i] = initPositions[i].z;
      }
    }
    prevPoints = initPositions.map(p => ({ x: p.x, y: p.y, z: p.z }));

    // Create geometry for all trail points
    const totalPoints = trailLength * numTracers;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 4);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));

    // Custom shader material for per-vertex alpha
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec4 color;
        varying vec4 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec4 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          gl_FragColor = vColor;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;

    function updateColors() {
      const colorAttr = geometry.attributes.color;

      // Find z range across all trail points
      let zMin = Infinity, zMax = -Infinity;
      for (let t = 0; t < trailLength; t++) {
        for (let i = 0; i < numTracers; i++) {
          const z = trailZ[t][i];
          if (z < zMin) zMin = z;
          if (z > zMax) zMax = z;
        }
      }
      const zRange = zMax - zMin + 1e-6;

      let idx = 0;
      for (let t = 0; t < trailLength; t++) {
        // Trail fade: older = more transparent
        const trailAlpha = (t + 1) / trailLength;

        for (let i = 0; i < numTracers; i++) {
          const z = trailZ[t][i];
          const zNorm = (z - zMin) / zRange;

          const rgb = blueYellowRed(zNorm);

          // Alpha modulation from Python: higher near middle z values
          const baseAlpha = 0.5 + 0.5 * (1 - Math.abs(zNorm - 0.5) * 2);
          const alpha = baseAlpha * trailAlpha * 0.8;

          colorAttr.array[idx * 4] = rgb.r;
          colorAttr.array[idx * 4 + 1] = rgb.g;
          colorAttr.array[idx * 4 + 2] = rgb.b;
          colorAttr.array[idx * 4 + 3] = alpha;
          idx++;
        }
      }
      colorAttr.needsUpdate = true;
    }

    function updatePositions() {
      const posAttr = geometry.attributes.position;
      let idx = 0;
      for (let t = 0; t < trailLength; t++) {
        for (let i = 0; i < numTracers; i++) {
          posAttr.array[idx * 3] = trailX[t][i];
          posAttr.array[idx * 3 + 1] = trailY[t][i];
          posAttr.array[idx * 3 + 2] = trailZ[t][i];
          idx++;
        }
      }
      posAttr.needsUpdate = true;
    }

    function animate() {
      requestAnimationFrame(animate);
      frame++;

      // Compute candidate quaternion (matching Python)
      const qCandidate = new THREE.Quaternion(
        Math.sin(frame * 0.01),
        Math.cos(frame * 0.01),
        Math.sin(frame * 0.005),
        1
      ).normalize();

      // SLERP interpolation (t=0.2 like Python)
      const qInterp = globalQPrev.clone().slerp(qCandidate, 0.2);
      globalQPrev.copy(qInterp);

      // Compute new attractor positions
      const newPositions = mobiusKleinAttractor(globalEffectiveT, qInterp);

      // Dynamic time scaling based on displacement
      let totalDisplacement = 0;
      for (let i = 0; i < numTracers; i++) {
        const dx = newPositions[i].x - prevPoints[i].x;
        const dy = newPositions[i].y - prevPoints[i].y;
        const dz = newPositions[i].z - prevPoints[i].z;
        totalDisplacement += Math.sqrt(dx*dx + dy*dy + dz*dz);
      }
      const avgSpeed = totalDisplacement / numTracers;
      const newDt = baseDt / (1 + alphaSpeed * avgSpeed);
      const dt = (1 - betaDt) * prevDt + betaDt * newDt;
      prevDt = dt;
      globalEffectiveT += dt;

      // Update prev points
      for (let i = 0; i < numTracers; i++) {
        prevPoints[i].x = newPositions[i].x;
        prevPoints[i].y = newPositions[i].y;
        prevPoints[i].z = newPositions[i].z;
      }

      // Shift trail buffers (older first)
      const oldX = trailX.shift();
      const oldY = trailY.shift();
      const oldZ = trailZ.shift();

      // Reuse arrays for new positions
      for (let i = 0; i < numTracers; i++) {
        oldX[i] = newPositions[i].x;
        oldY[i] = newPositions[i].y;
        oldZ[i] = newPositions[i].z;
      }
      trailX.push(oldX);
      trailY.push(oldY);
      trailZ.push(oldZ);

      updatePositions();
      updateColors();

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function onResize() {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
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
