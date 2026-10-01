// components/creations/Creations.tsx
"use client"
import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { PROJECTS, textColorFor } from "@/data/projects"
import Link from "next/link"
import { assetPath } from "@/lib/path"

// index 0 of a row's color array = highest z-index = final visible color (see notes above)
const LAYER_Z_INDEX = ["z-40", "z-30", "z-20", "z-10"]
const FILL_STAGGER = 0.1 // seconds between each layer starting

export default function Creations() {
  const listRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const imgARef = useRef<HTMLImageElement>(null)
  const imgBRef = useRef<HTMLImageElement>(null)

  // one paused fill/unfill timeline per row -> play() on enter, reverse() on leave
  const rowTimelines = useRef<gsap.core.Timeline[]>([])
  const layerRefs = useRef<HTMLDivElement[][]>(PROJECTS.map(() => []))

  // smooth springy follow for the floating preview window
  const quickX = useRef<gsap.QuickToFunc | null>(null)
  const quickY = useRef<gsap.QuickToFunc | null>(null)

  // double-buffered <img> tags so the wipe transition has an "incoming" and "outgoing" image
  const frontIsARef = useRef(true)
  const prevIndexRef = useRef<number | null>(null)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useGSAP(() => {
    // --- Build each row's fill timeline once, up front ---
    PROJECTS.forEach((project, rowIndex) => {
      const layers = layerRefs.current[rowIndex]
      gsap.set(layers, { scaleX: 0, transformOrigin: "left center" })

      const tl = gsap.timeline({ paused: true })
      const n = layers.length

      layers.forEach((layer, layerIndex) => {
        // layerIndex 0 is on top (z-40) and must finish LAST so it "wins" as the final color.
        // layerIndex (n-1) is on the bottom (z-10) and starts first (delay 0).
        const delay = (n - 1 - layerIndex) * FILL_STAGGER
        tl.to(layer, { scaleX: 1, duration: 0.5, ease: "power2.out" }, delay)
      })

      rowTimelines.current[rowIndex] = tl
    })

    // --- Floating preview window setup ---
    if (floatingRef.current) {
      gsap.set(floatingRef.current, { xPercent: -50, yPercent: -120, opacity: 0, scale: 0.92 })
      quickX.current = gsap.quickTo(floatingRef.current, "x", { duration: 0.8, ease: "elastic.out(1, 0.6)" })
      quickY.current = gsap.quickTo(floatingRef.current, "y", { duration: 0.8, ease: "elastic.out(1, 0.6)" })
    }
  }, [])

  const swapPreviewImage = (index: number) => {
    const prev = prevIndexRef.current
    if (prev === index) return

    const incomingIsA = !frontIsARef.current
    const incoming = incomingIsA ? imgARef.current : imgBRef.current
    const outgoing = incomingIsA ? imgBRef.current : imgARef.current
    if (!incoming) return

    // moving down the list -> new image wipes UP from below
    // moving up the list -> new image wipes DOWN from above
    const goingDown = prev === null ? true : index > prev
    const startY = goingDown ? "100%" : "-100%"

 incoming.src = assetPath(PROJECTS[index].image)
    gsap.set(incoming, { y: startY, zIndex: 20 })
    gsap.set(outgoing, { zIndex: 10 })
    gsap.to(incoming, { y: "0%", duration: 0.6, ease: "power3.out" })

    frontIsARef.current = incomingIsA
  }

  const handleRowEnter = (index: number) => {
    setHoveredIndex(index)
    rowTimelines.current[index]?.play()
    swapPreviewImage(index)
    prevIndexRef.current = index
  }

  const handleRowLeave = (index: number) => {
    setHoveredIndex(null)
    rowTimelines.current[index]?.reverse()
  }

  const handleListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = listRef.current?.getBoundingClientRect()
    if (!bounds) return
    quickX.current?.(e.clientX - bounds.left)
    quickY.current?.(e.clientY - bounds.top)
  }

  const handleListEnter = () => {
    gsap.to(floatingRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" })
  }

  const handleListLeave = () => {
    gsap.to(floatingRef.current, { opacity: 0, scale: 0.92, duration: 0.3, ease: "power2.in" })
    prevIndexRef.current = null
  }

  return (
    <section id="creations" className="relative w-full h-[180vh]">
      <div className="sticky top-0 h-dvh flex flex-col items-center p-6 md:p-12 overflow-hidden">
      <div className="h-48 flex mx-auto w-fit items-center">
        <h1 className="text-7xl text-center items-center">Projects</h1>
      </div>

      <div
        ref={listRef}
        onMouseEnter={handleListEnter}
        onMouseLeave={handleListLeave}
        onMouseMove={handleListMouseMove}
        className="relative w-fit min-w-6xl mx-auto py-8"
      >
        {PROJECTS.map((project, index) => {
          const isActive = hoveredIndex === index
          const activeText = textColorFor(project.colors[0])

          return (
            <Link
              href={`/${project.slug}`}
              key={project.id}
              onMouseEnter={() => handleRowEnter(index)}
              onMouseLeave={() => handleRowLeave(index)}
              className="relative block h-24 w-full max-w-6xl mx-auto overflow-hidden border-t border-white/20 last:border-b cursor-pointer"
            >
              {/* Stacked color layers, index 0 on top */}
              {project.colors.map((color, layerIndex) => (
                <div
                  key={layerIndex}
                  ref={(el) => {
                    if (el) layerRefs.current[index][layerIndex] = el
                  }}
                  className={`absolute inset-0 ${color} ${LAYER_Z_INDEX[layerIndex]}`}
                />
              ))}

              {/* Row content sits above every color layer */}
              <div className="relative z-50 flex h-full  w-full items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <span className={`text-md font-light tracking-widest transition-colors duration-300 ${isActive ? activeText : "text-white/40"}`}>
                    0{index + 1}
                  </span>
                  {/* size never changes on hover, only color */}
                  <h3 className={`text-4xl transition-colors duration-300 ${isActive ? activeText : "text-white"}`}>
                    {project.name}
                  </h3>
                </div>

                <div
                  className={`flex flex-col items-end gap-4 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
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

        {/* Cursor-following preview, hover-scoped only to this section via listRef handlers above */}
        <div
          ref={floatingRef}
          className="pointer-events-none absolute top-0 left-0 z-50 h-45 w-80 overflow-hidden rounded-lg shadow-lg border-white">
          <img ref={imgARef} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <img ref={imgBRef} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        </div>
      </div>
    </section>
  )
}
