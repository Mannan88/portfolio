"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shader";

const TRAIL_LENGTH = 14; // must match the shader

type HalftoneBackgroundProps = {
  gridSize?: number;
  radius?: number;
  bgColor?: string;
  dotColor?: string;
  interactive?: boolean;
};

export default function HalftoneBackground({
  gridSize = 40,
  radius = 0.3,
  bgColor = "#1a1a1a",
  dotColor = "#ffffff",
  interactive = true,
}: HalftoneBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    // the trail chain: one Vector2 per link, all starting at center
    const trailPositions = Array.from(
      { length: TRAIL_LENGTH },
      () => new THREE.Vector2(0.5, 0.5)
    );

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2() },
        uGridSize: { value: gridSize },
        uRadius: { value: radius },
        uBgColor: { value: new THREE.Color(bgColor) },
        uDotColor: { value: new THREE.Color(dotColor) },
        uTrail: { value: trailPositions },
        uHover: { value: 0 },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let targetHover = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height;
      targetMouse.set(x, y);
      targetHover = 1;
    };
    const onPointerLeave = () => {
      targetHover = 0;
    };

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerleave", onPointerLeave);
    }

    let frameId = 0;
    const render = () => {
      if (interactive) {
        // chain lerp: link 0 chases the real mouse, each link after
        // chases the one in front of it — this staggered delay is the trail
        trailPositions[0].lerp(targetMouse, 0.35);
        for (let i = 1; i < TRAIL_LENGTH; i++) {
          trailPositions[i].lerp(trailPositions[i - 1], 0.35);
        }

        material.uniforms.uHover.value +=
          (targetHover - material.uniforms.uHover.value) * 0.08;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [gridSize, radius, bgColor, dotColor, interactive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none"
    />
  );
}
