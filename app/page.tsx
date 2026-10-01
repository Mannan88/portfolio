"use client";
import { useEffect } from "react";
import Callme from "@/component/sections/Callme";
import Clouds from "@/component/sections/Clouds";
import Craft from "@/component/sections/Craft";
import Creations from "@/component/sections/Creations";
import Curious from "@/component/sections/Curious";

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <div className="w-screen overflow-x-clip">
      <Clouds />
      <Curious />
      <Craft />
      <Creations />
      <Callme />
    </div>

  );
}
