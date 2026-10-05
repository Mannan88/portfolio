"use client";
import { assetPath } from "@/lib/path";
import { CSSProperties, useEffect, useRef } from "react";

interface SpriteProps {
  src: string;
  frameCount: number;
  nativeWidth: number;
  nativeHeight: number;   // full frame height (64)
  letterTop?: number;
  letterHeight?: number;
  duration?: number;
  className?: string;
  zIndex?: number;
  scale?: number;         // upper limit for the responsive --s value
}

export default function Sprite({
  src,
  frameCount,
  nativeWidth,
  nativeHeight,
  letterTop = 16,
  letterHeight = 40,
  duration = 4,
  className = "",
  zIndex = 0,
  scale = 8,
}: SpriteProps) {
  const spriteRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const totalH = nativeHeight * frameCount;

   const s = `min(var(--s, ${scale}), ${scale})`;
   const px = (n: number) => `calc(${s} * ${n}px)`;

   const crop = "var(--crop, 0)"; //toggle for default height or reduced height
   const heightPx = `calc(${s} * (${nativeHeight} - ${nativeHeight - letterHeight} * ${crop}) * 1px)`;
   const topPx = `calc(${s} * ${-letterTop} * ${crop} * 1px)`;

  useEffect(() => {
    const el = spriteRef.current;
    if (!el) return;
    const onIteration = () => {
      if (!isHoveredRef.current) el.style.animationPlayState = "paused";
    };
    el.addEventListener("animationiteration", onIteration);
    return () => el.removeEventListener("animationiteration", onIteration);
  }, []);

  const containerStyle: CSSProperties = {
    width: px(nativeWidth),
    height: heightPx,
    zIndex,
  };

  const spriteStyle = {
    position: "absolute",
    left: 0,
    top: topPx,
    width: px(nativeWidth),
    height: px(totalH),
    backgroundImage: `url(${assetPath(src)})`,
    backgroundSize: `${px(nativeWidth)} ${px(totalH)}`,
    backgroundPosition: "0 0",
    imageRendering: "pixelated",
    animationName: "run-sprite",
    animationDuration: `${duration}s`,
    animationTimingFunction: `steps(${frameCount})`,
    animationIterationCount: "infinite",
    "--total-height": px(-totalH),
  } as CSSProperties;

  return (
    <div
      className="relative shrink-0 select-none overflow-hidden"
      style={containerStyle}
      aria-hidden="true"
    >
      <div ref={spriteRef} className={`sprite-engine ${className}`} style={spriteStyle} />
      <div
        className="absolute inset-0 cursor-pointer"
        onMouseEnter={() => {
          isHoveredRef.current = true;
          if (spriteRef.current) spriteRef.current.style.animationPlayState = "running";
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      />
    </div>
  );
}
