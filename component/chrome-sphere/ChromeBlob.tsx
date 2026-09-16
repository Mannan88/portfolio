"use client";

import { useRef } from "react";
import ChromeNoiseSphere, {
  ChromeNoiseSphereHandle,
} from "./ChromeNoiseSphere"

export default function ChromeNoiseSphereDemo() {
  const sphereRef = useRef<ChromeNoiseSphereHandle>(null);

  return (
    <div className="relative h-full w-full">
      <ChromeNoiseSphere ref={sphereRef} initialAmplitude={0.15} />

      <input
        type="range"
        min={0}
        max={0.5}
        step={0.01}
        defaultValue={0.15}
        onChange={(e) => sphereRef.current?.setPolish(Number(e.target.value))}
        className="absolute bottom-6 left-1/2 w-64 -translate-x-1/2"
      />
    </div>
  );
}
