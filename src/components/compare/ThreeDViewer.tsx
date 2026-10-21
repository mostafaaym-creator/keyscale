import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Box, Info } from 'lucide-react';
import { ComparisonSlot } from '@/types/keyboard';
import { getSlotColor } from '@/lib/palette';
import { useTheme } from '@/context/ThemeContext';

interface ThreeDViewerProps {
  slots: ComparisonSlot[];
  opacity: number;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ slots, opacity }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const [hasWebGL, setHasWebGL] = useState(true);

  const visibleSlots = slots.filter(s => s.visible);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = mountRef.current.clientWidth;
    const height = Math.min(480, Math.max(340, window.innerHeight * 0.45));

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x11161c : 0xf7f8fa);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 350, 500);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(200, 400, 300);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-200, -200, -200);
    scene.add(fillLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(800, 40, isDark ? 0x303b47 : 0xd1d5db, isDark ? 0x1f2937 : 0xe5e7eb);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Keyboard meshes
    const meshesGroup = new THREE.Group();
    scene.add(meshesGroup);

    let currentX = 0;
    const isSingleOrStacked = visibleSlots.length <= 1;

    visibleSlots.forEach((slot, idx) => {
      const origIdx = slots.findIndex(s => s.key === slot.key);
      const colorHex = getSlotColor(origIdx, isDark);
      const color = new THREE.Color(colorHex);

      const w = slot.keyboard.width || 320;
      const d = slot.keyboard.depth || 130;
      const h = slot.keyboard.height || 38;

      // Keyboard chassis
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: Math.max(0.2, opacity / 100),
        roughness: 0.35,
        metalness: 0.15
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Position: either stacked in center or offset side-by-side
      const posX = isSingleOrStacked ? 0 : currentX - (visibleSlots.length * 200) / 2 + 100;
      mesh.position.set(posX, h / 2, 0);

      // Keycap bed mockup surface
      const bedGeom = new THREE.BoxGeometry(w - 14, 4, d - 14);
      const bedMat = new THREE.MeshStandardMaterial({
        color: color.clone().multiplyScalar(0.7),
        transparent: true,
        opacity: Math.min(1, (opacity / 100) * 1.2),
        roughness: 0.6
      });
      const bedMesh = new THREE.Mesh(bedGeom, bedMat);
      bedMesh.position.set(posX, h + 2, 0);

      meshesGroup.add(mesh);
      meshesGroup.add(bedMesh);

      currentX += w + 40;
    });

    // Mouse drag interaction for rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      meshesGroup.rotation.y += deltaX * 0.008;
      meshesGroup.rotation.x = Math.max(-0.4, Math.min(0.8, meshesGroup.rotation.x + deltaY * 0.008));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [visibleSlots, opacity, isDark]);

  if (!hasWebGL) {
    return (
      <div className="w-full min-h-[350px] flex flex-col items-center justify-center p-8 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center">
        <Box className="w-12 h-12 text-zinc-400 mb-3" />
        <h3 className="font-semibold text-zinc-700 dark:text-zinc-200">WebGL Acceleration Not Available</h3>
        <p className="text-sm text-zinc-500 max-w-md mt-1">
          Your browser does not currently support WebGL rendering. Please switch to Overlay or Side-by-Side 2D mode for precise SVG scale comparisons.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5 font-semibold uppercase text-emerald-700 dark:text-emerald-400">
          <Box className="w-4 h-4" />
          <span>Interactive 3D Volumes</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
          <Info className="w-3.5 h-3.5" />
          <span>Click & drag to rotate view</span>
        </div>
      </div>

      <div ref={mountRef} className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      <div className="mt-3 pt-2 border-t border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>3D volumes represent verified physical bounds (W × D × H in mm).</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">True mm proportions</span>
      </div>
    </div>
  );
};
