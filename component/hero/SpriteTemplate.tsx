"use client";
import { CSSProperties, useEffect, useRef } from "react";

interface SpriteProps {
  src: string;
  frameCount: number;
  nativeWidth: number;
  nativeHeight: number;
  duration?: number;
  scale?: number;
  className?: string;
  zIndex?: number;
  containerHeight?: number; // outer clip box, avoids frame cutoff
  hitboxHeight?: number;    // actual visible letter height, hover target
}

export default function Sprite({
  src,
  frameCount,
  nativeWidth,
  nativeHeight,
  duration = 4,
  scale = 12,
  className = "",
  zIndex = 0,
  containerHeight = 480,
  hitboxHeight = 240,
}: SpriteProps) {
  const spriteRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  const finalWidth = nativeWidth * scale;
  const finalHeight = nativeHeight * scale;
  const totalSpriteHeight = finalHeight * frameCount;

  useEffect(() => {
    const el = spriteRef.current;
    if (!el) return;

    const handleIteration = () => {
      if (!isHoveredRef.current) {
        el.style.animationPlayState = "paused";
      }
    };

    el.addEventListener("animationiteration", handleIteration);
    return () => el.removeEventListener("animationiteration", handleIteration);
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (spriteRef.current) {
      spriteRef.current.style.animationPlayState = "running";
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  const containerStyle: CSSProperties = {
    width: `${finalWidth}px`,
    height: `${containerHeight}px`,
    overflow: "hidden",
    zIndex,
  };

  const spriteStyle = {
    backgroundImage: `url(${src})`,
    width: `${finalWidth}px`,
    height: `${totalSpriteHeight}px`,
    backgroundSize: `${finalWidth}px ${totalSpriteHeight}px`,
    backgroundPosition: "0px 0px",
    animationName: "run-sprite",
    animationDuration: `${duration}s`,
    animationTimingFunction: `steps(${frameCount})`,
    animationIterationCount: "infinite",
    "--total-height": `-${totalSpriteHeight}px`,
  } as CSSProperties;

  return (
    <div
      className="relative shrink-0 select-none"
      style={containerStyle}
      aria-hidden="true"
    >
      {/* Paint layer — untouched, no mouse handlers, no size changes */}
      <div
        ref={spriteRef}
        className={`sprite-engine ${className}`}
        style={spriteStyle}
      />

      {/* Hit-test layer — sized/positioned independently, sits on top */}
      <div
        className="absolute inset-x-0 bottom-26 cursor-pointer"
        style={{ height: `${hitboxHeight}px`, zIndex: 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
