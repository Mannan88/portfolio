"use client";
import Clouds from "@/component/sections/Clouds";
import Craft from "@/component/sections/Craft";
import Curious from "@/component/sections/Curious";
export default function Home() {
  return (
    <div className="w-screen overflow-x-hidden">
      <Clouds />
      <Curious />
      <Craft/>
    </div>
    //Credit https://blog.maximeheckel.com/#articles For the HalfTone BG.
  );
}
