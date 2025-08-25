import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Chart3D = ({ xAxis, yAxis, chartData }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!chartData || chartData.length === 0 || !xAxis || !yAxis) return;

    // Cleanup previous render
    mount.innerHTML = "";

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Light background

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(10, 15, 30); // Better viewing angle
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Controls (Orbit)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Axes Helper (optional)
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    // Prepare Bars
    const bars = chartData
      .map((row, index) => {
        const label = row[xAxis];
        const value = parseFloat(row[yAxis]);
        return {
          label: typeof label === "string" ? label : `Item ${index + 1}`,
          value: isNaN(value) ? 0 : value,
        };
      })
      .slice(0, 20); // Limit for clarity

    const group = new THREE.Group();

    bars.forEach((bar, i) => {
      const geometry = new THREE.BoxGeometry(1, bar.value, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x3498db });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(i * 1.5, bar.value / 2, 0);
      group.add(cube);
    });

    // Center the group
    group.position.x = -((bars.length - 1) * 1.5) / 2;
    scene.add(group);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      while (mount.firstChild) {
        mount.removeChild(mount.firstChild);
      }
    };
  }, [xAxis, yAxis, chartData]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "500px",
        border: "2px solid #ccc",
        borderRadius: "10px",
        background: "#fff",
        marginTop: "20px",
      }}
    />
  );
};

export default Chart3D;
