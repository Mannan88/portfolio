"use client"
import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PROJECTS, textColorFor } from "@/data/projects"
import Link from "next/link"
import { assetPath } from "@/lib/path"

gsap.registerPlugin(ScrollTrigger)

const LAYER_Z_INDEX = ["z-40", "z-30", "z-20", "z-10"]
const FILL_STAGGER = 0.1

export default function Creations() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const imgARef = useRef<HTMLImageElement>(null)
  const imgBRef = useRef<HTMLImageElement>(null)
  const rowRefs = useRef<HTMLAnchorElement[]>([])

  const backdropRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const drawerTl = useRef<gsap.core.Timeline | null>(null)

  const rowTimelines = useRef<gsap.core.Timeline[]>([])
  const layerRefs = useRef<HTMLDivElement[][]>(PROJECTS.map(() => []))

  const quickX = useRef<gsap.QuickToFunc | null>(null)
  const quickY = useRef<gsap.QuickToFunc | null>(null)

  const frontIsARef = useRef(true)
  const prevIndexRef = useRef<number | null>(null)

  const isDesktopRef = useRef(false)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState<boolean[]>(() => PROJECTS.map(() => false))
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useGSAP(
    () => {
      PROJECTS.forEach((_, rowIndex) => {
        const layers = layerRefs.current[rowIndex]
        gsap.set(layers, { scaleX: 0, transformOrigin: "left center" })

        const tl = gsap.timeline({ paused: true })
        const n = layers.length
        layers.forEach((layer, layerIndex) => {
          const delay = (n - 1 - layerIndex) * FILL_STAGGER
          tl.to(layer, { scaleX: 1, duration: 0.5, ease: "power2.out" }, delay)
        })
        rowTimelines.current[rowIndex] = tl
      })

      const mm = gsap.matchMedia()

      mm.add("(min-width: 1024px)", () => {
        isDesktopRef.current = true

        if (floatingRef.current) {
          gsap.set(floatingRef.current, { xPercent: -50, yPercent: -120, opacity: 0, scale: 0.92 })
          quickX.current = gsap.quickTo(floatingRef.current, "x", { duration: 0.8, ease: "elastic.out(1, 0.6)" })
          quickY.current = gsap.quickTo(floatingRef.current, "y", { duration: 0.8, ease: "elastic.out(1, 0.6)" })
        }

        return () => {
          isDesktopRef.current = false
          setHoveredIndex(null)
        }
      })

      mm.add("(max-width: 1023px)", () => {
        const triggers = rowRefs.current.map((rowEl, i) => {
          const setReveal = (v: boolean) => {
            const tl = rowTimelines.current[i]
            v ? tl?.play() : tl?.reverse()
            setRevealed((prev) => {
              if (prev[i] === v) return prev
              const next = [...prev]
              next[i] = v
              return next
            })
          }
          return ScrollTrigger.create({
            trigger: rowEl,
            start: "top 88%",
            onEnter: () => setReveal(true),
            onLeaveBack: () => setReveal(false),
          })
        })

        const items = gsap.utils.toArray<HTMLElement>(".d-item", drawerRef.current)
        gsap.set(drawerRef.current, { yPercent: 100 })
        gsap.set(backdropRef.current, { opacity: 0 })

        drawerTl.current = gsap
          .timeline({ paused: true })
          .set(drawerRef.current, { visibility: "visible" }, 0)
          .to(backdropRef.current, { opacity: 1, duration: 0.45, ease: "power2.out" }, 0)
          .to(drawerRef.current, { yPercent: 0, duration: 0.65, ease: "power3.out" }, 0)
          .fromTo(
            items,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out" },
            0.25
          )

        return () => {
          triggers.forEach((t) => t.kill())
          rowTimelines.current.forEach((tl) => tl.pause().progress(0))
          setRevealed(PROJECTS.map(() => false))
          drawerTl.current = null
          setIsOpen(false)
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  const openDrawer = (index: number) => {
    setDrawerIndex(index)
    setIsOpen(true)
    drawerTl.current?.play()
  }
  const closeDrawer = () => {
    setIsOpen(false)
    drawerTl.current?.reverse()
  }

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen])

  const swapPreviewImage = (index: number) => {
    const prev = prevIndexRef.current
    if (prev === index) return

    const incomingIsA = !frontIsARef.current
    const incoming = incomingIsA ? imgARef.current : imgBRef.current
    const outgoing = incomingIsA ? imgBRef.current : imgARef.current
    if (!incoming) return

    const goingDown = prev === null ? true : index > prev
    const startY = goingDown ? "100%" : "-100%"

    incoming.src = assetPath(PROJECTS[index].image)
    gsap.set(incoming, { y: startY, zIndex: 20 })
    gsap.set(outgoing, { zIndex: 10 })
    gsap.to(incoming, { y: "0%", duration: 0.6, ease: "power3.out" })

    frontIsARef.current = incomingIsA
  }

  const handleRowEnter = (index: number) => {
    if (!isDesktopRef.current) return
    setHoveredIndex(index)
    rowTimelines.current[index]?.play()
    swapPreviewImage(index)
    prevIndexRef.current = index
  }

  const handleRowLeave = (index: number) => {
    if (!isDesktopRef.current) return
    setHoveredIndex(null)
    rowTimelines.current[index]?.reverse()
  }

  const handleRowClick = (e: React.MouseEvent, index: number) => {
    if (isDesktopRef.current) return
    e.preventDefault()
    openDrawer(index)
  }

  const handleListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktopRef.current) return
    const bounds = listRef.current?.getBoundingClientRect()
    if (!bounds) return
    quickX.current?.(e.clientX - bounds.left)
    quickY.current?.(e.clientY - bounds.top)
  }

  const handleListEnter = () => {
    if (!isDesktopRef.current) return
    gsap.to(floatingRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" })
  }

  const handleListLeave = () => {
    if (!isDesktopRef.current) return
    gsap.to(floatingRef.current, { opacity: 0, scale: 0.92, duration: 0.3, ease: "power2.in" })
    prevIndexRef.current = null
  }

  const dp = PROJECTS[drawerIndex ?? 0]
  const drawerText = textColorFor(dp.colors[0])

  return (
    <section ref={sectionRef} id="creations" className="relative h-[180vh] w-full">
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-hidden p-6 md:p-12">
        <div className="flex h-32 w-fit items-center lg:h-48">
          <h1 className="text-center text-5xl md:text-6xl lg:text-7xl">Projects</h1>
        </div>

        <div
          ref={listRef}
          onMouseEnter={handleListEnter}
          onMouseLeave={handleListLeave}
          onMouseMove={handleListMouseMove}
          className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 py-4 md:gap-4 lg:py-8"
        >
          {PROJECTS.map((project, index) => {
            const isActive = hoveredIndex === index || revealed[index]
            const activeText = textColorFor(project.colors[0])

            return (
              <Link
                href={`/${project.slug}`}
                key={project.id}
                ref={(el) => {
                  if (el) rowRefs.current[index] = el
                }}
                onClick={(e) => handleRowClick(e, index)}
                onMouseEnter={() => handleRowEnter(index)}
                onMouseLeave={() => handleRowLeave(index)}
                className="relative mx-auto block h-28 w-full cursor-pointer overflow-hidden border-y border-white/20 md:h-36 lg:h-24"
              >
                {project.colors.map((color, layerIndex) => (
                  <div
                    key={layerIndex}
                    ref={(el) => {
                      if (el) layerRefs.current[index][layerIndex] = el
                    }}
                    className={`absolute inset-0 ${color} ${LAYER_Z_INDEX[layerIndex]}`}
                  />
                ))}

                <div className="relative z-50 flex h-full w-full items-center justify-between gap-4 px-4">
                  <div className="flex min-w-0 items-center gap-3 md:gap-4">
                    <span
                      className={`text-sm font-light tracking-widest transition-colors duration-300 md:text-md ${
                        isActive ? activeText : "text-white/40"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <h3
                      className={`text-2xl leading-tight transition-colors duration-300 md:text-4xl ${
                        isActive ? activeText : "text-white"
                      }`}
                    >
                      {project.name}
                    </h3>
                  </div>

                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md md:h-24 md:w-44 lg:hidden">
                    <img
                      src={assetPath(project.image)}
                      alt={project.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div
                    className={`hidden flex-col items-end gap-4 transition-opacity duration-300 lg:flex ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className={`text-md uppercase tracking-widest ${activeText}`}>
                      {project.category}
                    </span>
                    <div className="flex flex-wrap justify-end gap-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className={`text-xs tracking-wider ${activeText}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          <div
            ref={floatingRef}
            className="pointer-events-none absolute left-0 top-0 z-50 hidden h-45 w-80 overflow-hidden rounded-lg border-white shadow-lg lg:block"
          >
            <img ref={imgARef} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <img ref={imgBRef} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div
          ref={backdropRef}
          onClick={closeDrawer}
          className={`fixed inset-0 z-90 bg-black/40 opacity-0 ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        />

        <aside
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-hidden={!isOpen}
          className={`invisible fixed inset-x-0 bottom-0 z-[100] h-[40dvh] min-h-80 rounded-t-3xl shadow-2xl ${dp.colors[0]} ${drawerText}`}
        >
          <button
            onClick={closeDrawer}
            aria-label="Close project preview"
            className="d-item absolute inset-x-0 top-0 flex justify-center pb-2 pt-3"
          >
            <span className="h-1 w-10 rounded-full bg-current opacity-40" />
          </button>

          <div className="flex h-full flex-col gap-4 px-5 pb-6 pt-8 md:flex-row md:gap-8 md:px-10">
            <div className="d-item min-h-0 flex-1 overflow-hidden rounded-xl md:w-1/2 md:flex-none">
              <img
                src={assetPath(dp.image)}
                alt={dp.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex shrink-0 flex-col justify-center gap-3 md:flex-1">
              <span className="d-item text-xs uppercase tracking-widest opacity-70">
                0{(drawerIndex ?? 0) + 1} — {dp.category}
              </span>

              <div className="flex items-center justify-between gap-3 md:flex-col md:items-start md:gap-4">
                <h3 className="d-item text-2xl leading-tight md:text-4xl">{dp.name}</h3>
                <Link
                  href={`/${dp.slug}`}
                  onClick={closeDrawer}
                  className="d-item shrink-0 rounded-full border border-current px-4 py-2 text-xs uppercase tracking-widest"
                >
                  View project →
                </Link>
              </div>

              <div className="d-item flex flex-wrap gap-2">
                {dp.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-current px-3 py-1 text-xs tracking-wider"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
