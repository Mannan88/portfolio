"use client";
import Clouds from "@/component/sections/Clouds";
import Curious from "@/component/sections/Curious";
export default function Home() {
  return (
    <div className="w-screen overflow-x-hidden">
      <Clouds />
      <Curious/>
    </div>
  );
}
