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

// mobile
const M_SEG = 3
const M_LEAD = 0.6
const M_SCROLL_PER_STAGE = 150
const ARC_GAP = 40
const ARC_R = 200

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
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px)", () => {
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
          sphereRef.current?.setPolish(progress)
          gsap.set(marqueeTrackRefTop.current, { xPercent: -progress * MARQUEE_SPEED })
          gsap.set(marqueeTrackRefBottom.current, { xPercent: -progress * MARQUEE_SPEED })
          gsap.set(titleTrackRef.current, { xPercent: progress * titleFinalXPercent })
        },
      })

      return () => window.removeEventListener("resize", remeasure)
    })

    /* MOBILE */
    mm.add("(max-width: 767px)", () => {
      const root = containerRef.current!
      const N = STAGES.length

      const layers = gsap.utils.toArray<HTMLElement>(".m-layer", root)
      const cards = gsap.utils.toArray<HTMLElement>(".m-card", root)
      const dots = gsap.utils.toArray<HTMLElement>(".m-dot", root)
      const dotColors = gsap.utils.toArray<HTMLElement>(".m-dot-color", root)
      const arc = root.querySelector<HTMLElement>(".m-arc")!
      let openIndex = -1
      let busy = false

      const openTls = cards.map((card) => {
        const base = card.querySelector<HTMLElement>(".m-base")!
        const panel = card.querySelector<HTMLElement>(".m-panel")!
        const items = panel.querySelectorAll(".m-item")

        return gsap
          .timeline({
            paused: true,
            onComplete: () => {
              busy = false
            },
            onReverseComplete: () => {
              busy = false
              openIndex = -1
            },
          })
          .set(panel, { pointerEvents: "auto" }, 0)
          .to(base, { opacity: 0, duration: 0.2, ease: "none" }, 0)
          .fromTo(
            panel,
            { clipPath: "inset(0% 50% 0% 50%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" },
            0
          )
          .fromTo(
            items,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
            0.4
          )
      })

      const open = (i: number) => {
        if (busy || openIndex !== -1) return
        openIndex = i
        busy = true
        openTls[i].play()
      }
      const close = () => {
        if (busy || openIndex === -1) return
        busy = true
        openTls[openIndex].reverse()
      }

      const clickHandlers = cards.map((card, i) => {
        const fn = () => (openIndex === i ? close() : open(i))
        card.addEventListener("click", fn)
        return fn
      })

      const blockScroll = (e: Event) => {
        if (openIndex === -1) return
        if (e.cancelable) e.preventDefault()
        close()
      }
      window.addEventListener("wheel", blockScroll, { passive: false })
      window.addEventListener("touchmove", blockScroll, { passive: false })

      /* arc indicator */
      let pos = 0
      const mix = { v: 0 }

      const render = () => {
        dots.forEach((dot, i) => {
          const d = i - pos
          const x = d * ARC_GAP
          const cx = Math.max(-ARC_R * 0.98, Math.min(ARC_R * 0.98, x))
          const y = ARC_R - Math.sqrt(ARC_R * ARC_R - cx * cx)
          const near = Math.max(0, 1 - Math.abs(d))
          const fade = gsap.utils.clamp(0, 1, 1 - (Math.abs(d) - 2.5) / 1.5)

          gsap.set(dot, { x, y, scale: 1 + near * 0.6, opacity: fade })
          gsap.set(dotColors[i], { opacity: near * mix.v })
        })
      }
      render()

      const arcIn = gsap.fromTo(
        arc,
        { yPercent: -120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", paused: true }
      )
      const fadeMix = (v: number) =>
        gsap.to(mix, { v, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: render })

      /* master timeline */
      let lastActive = -2
      const sync = () => {
        const k = (master.time() - M_LEAD) / M_SEG
        pos = gsap.utils.clamp(0, N - 1, k - 0.5)

        const active = k >= 0 && k < N ? Math.floor(k) : -1
        if (active !== lastActive) {
          lastActive = active
          cards.forEach((c, i) => gsap.set(c, { pointerEvents: i === active ? "auto" : "none" }))
        }

        sphereRef.current?.setPolish(master.progress())
        render()
      }

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${N * M_SCROLL_PER_STAGE}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            arcIn.play()
            fadeMix(1)
          },
          onEnterBack: () => {
            arcIn.play()
            fadeMix(1)
          },
          onLeave: () => fadeMix(0),
          onLeaveBack: () => {
            arcIn.reverse()
            fadeMix(0)
          },
        },
        onUpdate: sync,
      })

      layers.forEach((layer, i) => {
        const t = M_LEAD + i * M_SEG
        master
          .fromTo(
            layer,
            { opacity: 0, yPercent: 10 },
            { opacity: 1, yPercent: 0, duration: 1, ease: "power2.out" },
            t
          )
          .to(layer, { opacity: 0, yPercent: -10, duration: 1, ease: "power2.in" }, t + 2)
      })

      return () => {
        cards.forEach((c, i) => c.removeEventListener("click", clickHandlers[i]))
        window.removeEventListener("wheel", blockScroll)
        window.removeEventListener("touchmove", blockScroll)
      }
    })

    return () => mm.revert()
  })

  return (
    <section ref={containerRef} id="craft" className="craft-section relative w-full h-dvh md:h-screen">
      <div className="pin-wrapper relative h-dvh md:h-screen w-full overflow-hidden">

        {/* DESKTOP / TABLET: horizontal title track */}
        <div
          ref={titleTrackRef}
          style={{ left: TRACK_START_X }}
          className="absolute inset-y-0 z-10 hidden md:flex items-center gap-12 whitespace-nowrap will-change-transform"
        >
          {STAGES.map((stage, i) => (
            <div
              key={i}
              className="group relative h-screen w-fit flex items-center justify-center cursor-pointer select-none"
            >
              <div className={`${stage.color} px-4`}>
                <h2 className="text-[#1a1a1a] text-6xl font-normal leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-0">
                  {stage.title}
                </h2>
              </div>
              <div
                className={`
                  ${stage.color}
                  pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between py-24 px-8 [clip-path:inset(50%_0%_50%_0%)] group-hover:[clip-path:inset(0%_0%_0%_0%)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] `}
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#1a1a1a]/60 translate-y-4 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                  0{i + 1}
                </span>
                <h2 className="text-[#1a1a1a] text-6xl font-normal leading-none tracking-tight">
                  {stage.title}
                </h2>
                <p className="w-full max-w-full whitespace-normal text-center text-sm font-medium leading-relaxed text-[#1a1a1a]/85 -translate-y-4 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          {STAGES.map((stage, i) => (
            <div
              key={i}
              className="m-layer pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0"
            >
              <div className="m-card pointer-events-none relative cursor-pointer select-none">
                <div className={`m-base ${stage.color} px-4 py-2`}>
                  <h2 className="text-[#1a1a1a] text-4xl font-normal leading-none tracking-tight whitespace-nowrap">
                    {stage.title}
                  </h2>
                </div>
                <div
                  className={`m-panel ${stage.color} pointer-events-none absolute left-1/2 top-1/2 flex w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 px-6 py-10 text-center [clip-path:inset(0%_50%_0%_50%)]`}
                >
                  <span className="m-item font-mono text-xs uppercase tracking-[0.25em] text-[#1a1a1a]/60">
                    0{i + 1}
                  </span>
                  <h2 className="m-item text-[#1a1a1a] text-4xl font-normal leading-none tracking-tight">
                    {stage.title}
                  </h2>
                  <p className="m-item text-sm font-medium leading-relaxed text-[#1a1a1a]/85">
                    {stage.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* arc stage indicator */}
          <div className="m-arc pointer-events-none absolute inset-x-0 top-0 z-40 h-28 opacity-0">
            <div className="absolute left-1/2 top-0">
              {STAGES.map((stage, i) => (
                <div key={i} className="m-dot absolute top-8 h-4 w-4">
                  <span className="absolute inset-0 rounded-full bg-neutral-600" />
                  <span className={`m-dot-color absolute inset-0 rounded-full opacity-0 ${stage.color}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 z-3 md:z-10 h-72 w-72 md:h-96 md:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a1a] opacity-40 blur-2xl pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 z-4 md:z-20 h-84 w-84 md:h-112 md:w-md -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <ChromeNoiseSphere ref={sphereRef} />
        </div>

        <div className="absolute bottom-0 border-t border-white/15 left-0 z-30 hidden md:block w-full overflow-hidden pointer-events-none bg-[#0a0a0a]/60 backdrop-blur-xs py-2">
          <div ref={marqueeTrackRefBottom} className="flex items-center gap-6 whitespace-nowrap will-change-transform">
            {Array.from({ length: MARQUEE_REPEAT * 2 }).map((_, i) => (
              <span key={i} className="text-2xl font-normal uppercase tracking-widest text-gray-400">
                {MARQUEE_PHRASE} <span className="text-gray-600 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>

        <div className="absolute top-0 border-b border-white/15 left-0 z-30 hidden md:block w-full overflow-hidden pointer-events-none bg-[#0a0a0a]/60 backdrop-blur-xs py-2">
          <div ref={marqueeTrackRefTop} className="flex items-center gap-6 whitespace-nowrap will-change-transform">
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
