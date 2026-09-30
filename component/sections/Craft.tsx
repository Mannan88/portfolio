// components/craft/Craft.tsx
"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ChromeNoiseSphere, { ChromeNoiseSphereHandle } from "../chrome-sphere/ChromeNoiseSphere"
import { STAGES } from "@/data/stages"

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_SPEED = 40
const TRACK_START_VW = 90
const TRACK_END_VW = 0
const TRACK_START_X = `${TRACK_START_VW}vw`
const SCROLL_LENGTH_PERCENT = STAGES.length * 200
const MARQUEE_PHRASE = "Process matters"
const MARQUEE_REPEAT = 20

function measureFinalXPercent(trackEl: HTMLDivElement | null, targetVw: number) {
  if (!trackEl) return 0
  const lastChild = trackEl.lastElementChild as HTMLElement | null
  if (!lastChild) return 0

  const trackRect = trackEl.getBoundingClientRect()
  const lastRect = lastChild.getBoundingClientRect()
  const lastOffsetFromTrackStart = lastRect.left - trackRect.left

  const targetPx = (targetVw / 100) * window.innerWidth
  const lastItemCurrentPx = trackRect.left + lastOffsetFromTrackStart
  const requiredTranslatePx = targetPx - lastItemCurrentPx

  return (requiredTranslatePx / trackRect.width) * 100
}

export default function Craft() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<ChromeNoiseSphereHandle>(null)

  const marqueeTrackRefTop = useRef<HTMLDivElement>(null)
  const marqueeTrackRefBottom = useRef<HTMLDivElement>(null)
  const titleTrackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    let titleFinalXPercent = measureFinalXPercent(titleTrackRef.current, TRACK_END_VW)

    const remeasure = () => {
      gsap.set(titleTrackRef.current, { xPercent: 0 })
      titleFinalXPercent = measureFinalXPercent(titleTrackRef.current, TRACK_END_VW)
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", remeasure)

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${SCROLL_LENGTH_PERCENT}%`,
      pin: containerRef.current,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress

        // Safe check if setPolish exists on your handle
        if (sphereRef.current && "setPolish" in sphereRef.current) {
          ;(sphereRef.current).setPolish(progress)
        }

        gsap.set(marqueeTrackRefTop.current, { xPercent: -progress * MARQUEE_SPEED })
        gsap.set(marqueeTrackRefBottom.current, { xPercent: -progress * MARQUEE_SPEED })
        gsap.set(titleTrackRef.current, { xPercent: progress * titleFinalXPercent })
      },
    })

    return () => {
      window.removeEventListener("resize", remeasure)
    }
  })

  return (
    <section ref={containerRef} id="craft" className="craft-section relative w-full h-screen">
      <div className="pin-wrapper relative h-screen w-full overflow-hidden">

        {/* TITLES & VERTICAL STRIPS TRACK
            Stretches top-0 to bottom-0 (100vh) so child strips can expand full screen height */}
        <div
          ref={titleTrackRef}
          style={{ left: TRACK_START_X }}
          className="absolute inset-y-0 z-10 flex items-center gap-12 whitespace-nowrap will-change-transform"
        >
          {STAGES.map((stage, i) => {

            return (
              <div
                key={i}
                className="group relative h-screen w-fit flex items-center justify-center cursor-pointer select-none"
              >
                {/* 1. BASE LAYER TITLE (Visible before hover) */}
                <div className={` ${stage.color} px-4`}>
                <h2 className="text-[#1a1a1a] text-6xl font-normal leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-0">
                  {stage.title}
                </h2></div>
                {/* 2. EXPANDING VERTICAL STRIP (Opens from vertical center to 100vh, closes back to center) */}
                <div
                className={`
                    ${stage.color}
                    pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between py-24 px-8 [clip-path:inset(50%_0%_50%_0%)] group-hover:[clip-path:inset(0%_0%_0%_0%)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] `}
                >
                  {/* Top subtle index / stage counter */}
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#1a1a1a]/60 translate-y-4 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                    0{i + 1}
                  </span>

                  {/* Middle Title inside the strip (Locked to exact same center position) */}
                  <h2 className="text-[#1a1a1a] text-6xl font-normal leading-none tracking-tight">
                    {stage.title}
                  </h2>

                  {/* Bottom Paragraph inside the strip (Wraps strictly within the title's strip width) */}
                  <p className="w-full max-w-full whitespace-normal text-center text-sm font-medium leading-relaxed text-[#1a1a1a]/85 -translate-y-4 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                    {stage.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Subtle shadow behind the sphere */}
        <div className="absolute top-1/2 left-1/2 z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a1a] opacity-40 blur-2xl pointer-events-none" />

        {/* Sphere — pointer-events-none ensures you can still hover strips even when behind the sphere */}
        <div className="absolute top-1/2 left-1/2 z-20 h-112 w-md -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <ChromeNoiseSphere ref={sphereRef} />
        </div>

        {/* Bottom marquee bar */}
        <div className="absolute bottom-0 border-t border-white/15 left-0 z-30 w-full overflow-hidden pointer-events-none bg-[#0a0a0a]/60 backdrop-blur-xs py-2">
          <div
            ref={marqueeTrackRefBottom}
            className="flex items-center gap-6 whitespace-nowrap will-change-transform"
          >
            {Array.from({ length: MARQUEE_REPEAT * 2 }).map((_, i) => (
              <span key={i} className="text-2xl font-normal uppercase tracking-widest text-gray-400">
                {MARQUEE_PHRASE} <span className="text-gray-600 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Top marquee bar */}
        <div className="absolute top-0 border-b border-white/15 left-0 z-30 w-full overflow-hidden pointer-events-none bg-[#0a0a0a]/60 backdrop-blur-xs py-2">
          <div
            ref={marqueeTrackRefTop}
            className="flex items-center gap-6 whitespace-nowrap will-change-transform"
          >
            {Array.from({ length: MARQUEE_REPEAT * 2 }).map((_, i) => (
              <span key={i} className="text-2xl font-normal uppercase tracking-widest text-gray-400">
                {MARQUEE_PHRASE} <span className="text-gray-600 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
