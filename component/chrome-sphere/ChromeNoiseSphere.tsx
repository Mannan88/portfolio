"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import { OrbitControls, SimplexNoise } from "three/examples/jsm/Addons.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type ChromeNoiseSphereHandle = {
  setPolish: (value: number) => void;
};
type ChromeNoiseSphereProps = {
  initialAmplitude?: number;
  frequency?: number;
  speed?: number;
  metalness?: number;
  roughness?: number;
  color?: string;
};

const ChromeNoiseSphere = forwardRef<ChromeNoiseSphereHandle, ChromeNoiseSphereProps>(
  function ChromeNoiseSphere(
    {
      initialAmplitude = 0.4,
      frequency = 1.5,
      speed = 0.2,
      metalness = 0,
      roughness = 0.2,
      color = "#ffffff",
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const metalnessRef = useRef(metalness);
    const roughnessRef = useRef(roughness);
    const haloStrengthRef = useRef(0.6);
    // Live-adjustable value, read every frame — not React state, since
    // React state would re-render and re-trigger this whole effect on
    // every slider tick, tearing down and rebuilding the WebGL scene.
    const amplitudeRef = useRef(initialAmplitude);
    // Exposes an imperative method so a PARENT component (e.g. a slider's
    // onChange handler) can push new values in without owning any of the
    // WebGL setup itself. Same pattern you'll want for your portfolio's
    // Section 3 shape-adjustment slider.
    useImperativeHandle(ref, () => ({
      setPolish: (progress: number) => {
        // Math.cos goes 1 -> -1. We adjust it to smoothly go from 1 to 0.
        const easeCurve = (1 + Math.cos(progress * Math.PI)) / 2;
        amplitudeRef.current = easeCurve * 0.4;
        roughnessRef.current = easeCurve * 0.1 + 0.1;
        haloStrengthRef.current = progress * 0.6;
        metalnessRef.current = progress * 1;
      },
    }));
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const simplex = new SimplexNoise();

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000,0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      container.appendChild(renderer.domElement);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      // --- environment map: this is what makes chrome look like chrome ---
      // PMREMGenerator + RoomEnvironment builds a ready-made HDRI-like
      // environment procedurally, so there's no external .hdr file to host.
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRenderTarget.texture;

      // A light subtle highlight on top of the env reflections — not
      // strictly required (the environment does most of the work), but
      // gives a cleaner, more directional specular highlight.
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(3, 3, 3);
      scene.add(keyLight);
      // const keyLightTwo = new THREE.DirectionalLight(0x111111, 1);
      // keyLight.position.set(2,-3, 3);
      // scene.add(keyLightTwo);


      // --- geometry: enough subdivisions for smooth-looking displacement ---
      const geometry = new THREE.SphereGeometry(1, 128, 128);
      const position = geometry.attributes.position;

      // store each vertex's original (undisplaced) direction/length —
      // noise displaces ALONG the sphere's normal, not along raw x/y/z,
      // otherwise the shape would skew instead of staying round-ish.
      const basePositions = position.array.slice();

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness,
        roughness,
      });

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uHaloStrength = {value:haloStrengthRef.current};
        material.userData.shader = shader;
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <common>",
          `
          #include <common>

          uniform float uTime;
          uniform float uHaloStrength;
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          /* glsl */ `
          vec3 viewDir = normalize(-vViewPosition);

          // MeshPhysicalMaterial already provides the normal.
          vec3 surfaceNormal = normalize(vNormal);

          float fresnel = pow(
            1.0 - abs(dot(surfaceNormal, viewDir)),
            3.0
          );

          float hue = fract(fresnel * 1.5 + uTime * 0.05);

          vec3 rainbow = vec3(
            abs(hue * 6.0 - 3.0) - 1.0,
            2.0 - abs(hue * 6.0 - 2.0),
            2.0 - abs(hue * 6.0 - 4.0)
          );

          rainbow = clamp(rainbow, 0.0, 1.0);

          gl_FragColor.rgb += rainbow * fresnel * uHaloStrength;

          #include <dithering_fragment>
          `
        );
      };
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enableZoom = false;
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      let animationId: number;

      function animate(time: number) {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = time * 0.001;
        const amplitude = amplitudeRef.current;

        for (let i = 0; i < position.count; i++) {
          const ix = i * 3;
          const bx = basePositions[ix];
          const by = basePositions[ix + 1];
          const bz = basePositions[ix + 2];

          const noiseValue = simplex.noise3d(
            bx * frequency + elapsedTime * speed,
            by * frequency,
            bz * frequency
          );

          const displacement = 1 + noiseValue * amplitude;

          position.setXYZ(i, bx * displacement, by * displacement, bz * displacement);
        }

        position.needsUpdate = true;
        geometry.computeVertexNormals(); // <-- required for correct chrome reflections

        mesh.rotation.y = elapsedTime * 0.15;
        material.roughness = roughnessRef.current;
        material.metalness = metalnessRef.current;
        // inside animate(), before renderer.render:
       if (material.userData.shader) {
         material.userData.shader.uniforms.uTime.value = elapsedTime;
         material.userData.shader.uniforms.uHaloStrength.value = haloStrengthRef.current;
       }
        controls.update();
        renderer.render(scene, camera);
      }
      animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        envRenderTarget.texture.dispose();
        pmremGenerator.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        controls.dispose();
      };
    }, [frequency, speed, metalness, roughness, color]);

    return <div ref={containerRef} className="bg-transparent h-full w-full" />;
  }
);

export default ChromeNoiseSphere;
