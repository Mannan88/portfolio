"use client";
import Callme from "@/component/sections/Callme";
import Clouds from "@/component/sections/Clouds";
import Craft from "@/component/sections/Craft";
import Creations from "@/component/sections/Creations";
import Curious from "@/component/sections/Curious";
export default function Home() {
  return (
    <div className="w-screen overflow-x-clip">
      <Clouds />
      <Curious />
      <Craft />
      <Creations />
      <Callme />
    </div>
    //Credit https://blog.maximeheckel.com/#articles For the HalfTone BG.
  );
}
