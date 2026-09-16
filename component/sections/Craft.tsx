"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import { useRef } from "react";
import ChromeNoiseSphere from "../chrome-sphere/ChromeNoiseSphere";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChromeNoiseSphereHandle } from "../chrome-sphere/ChromeNoiseSphere";
import { STAGES } from "@/data/stages";
gsap.registerPlugin(ScrollTrigger);
export default function Craft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<ChromeNoiseSphereHandle>(null);
  useGSAP(() => {
    const pinContainer = document.getElementsByClassName("pin-wrapper")
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
       // markers: true,
        pin: containerRef.current,
        scrub: true,
        onUpdate: (self) => {
        sphereRef.current?.setPolish(self.progress)
        }

    }})
    mainTl.to('.bg-text-1', { xPercent: -20, ease: "none" }, 0);
    mainTl.to('.bg-text-2', { xPercent: 20, ease: "none" }, 0);
    STAGES.forEach((_, i) => {
      // We use `i` as the start time on the timeline (0, 1, 2, 3...)
      // This ensures they space out perfectly.
      const startTime = i;

      // 1. Fade IN and slide UP the current description
      mainTl.to(`.stage-desc-${i}`, { opacity: 1, y: 0, duration: 0.5 }, startTime);

      // 2. Rotate to 0 and light up the current indicator
      mainTl.to(`.stage-indicator-${i} span`, { duration: 0.5 }, startTime);
      mainTl.to(`.stage-indicator-${i}`, { opacity: 1, duration: 0.5 }, startTime);

      // 3. Fade OUT the PREVIOUS description & indicator (if this isn't the first one)
      if (i > 0) {
        mainTl.to(`.stage-desc-${i-1}`, { opacity: 0, y: -20, duration: 0.5 }, startTime);
        mainTl.to(`.stage-indicator-${i-1} span`, { duration: 0.5 }, startTime);
        mainTl.to(`.stage-indicator-${i-1}`, { opacity: 0.3, duration: 0.5 }, startTime);
      }
    });
})
  return (
    <section ref={containerRef} id="craft" className="craft-section w-full h-screen relative">
      <div className="pin-wrapper h-screen w-full relative overflow-hidden ">
        <div className="h-48 flex mx-auto w-fit items-center">
          <h1 className="text-7xl text-center items-center">Process Matters</h1>
        </div>
        {/*<div className="absolute inset-0 z-0 flex flex-col justify-between py-20 pointer-events-none opacity-20">
            <h1 className="bg-text-1 text-[15vw] whitespace-nowrap leading-none">PROCESS MATTERS PROCESS MATTERS</h1>
            <h1 className="bg-text-2 text-[15vw] whitespace-nowrap leading-none text-right">CRAFT MATTERS CRAFT MATTERS</h1>
        </div>*/}
        <div className="absolute right-20 -translate-y-1/2 top-1/2 w-80 z-20">
            {STAGES.map((stage, i) => (
              <div key={i} className={`stage-desc stage-desc-${i} absolute top-0 left-0 opacity-0 translate-y-4`}>
                <h3 className={`text-2xl ${stage.color} font-medium mb-2`}>{stage.title}</h3>
                <p className="text-gray-400 tracking-wide">{stage.desc}</p>
              </div>
            ))}
        </div>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            {STAGES.map((stage, i) => (
              <div key={i} className={`stage-indicator stage-indicator-${i} opacity-36 origin-bottom`}>
                <span className="block text-sm uppercase tracking-widest -rotate-75">{stage.title}</span>
              </div>
            ))}
          </div>
        <div className="absolute left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2">
        <ChromeNoiseSphere ref={sphereRef}/>
         </div>

         </div>
    </section>
  )
}
