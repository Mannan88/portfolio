"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { images } from "@/data/images"
import Image from "next/image"

interface BezierCarouselProps {
  className?: string
}

const COPIES = 1
const AUTO_SPEED = 0.001
const DRAG_SPEED = 0.001
const VISCOUS_LERP = 0.12

const CARD_SPACING = 3
const HOVER_SCALE = 1.02
const HOVER_LIFT = 14
const HOVER_LERP = 0.15

export default function BezierCarousel({ className }: BezierCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const phaseRef = useRef(0)
  const visualPhaseRef = useRef(0)
  const velocityRef = useRef(AUTO_SPEED)

  const draggingRef = useRef(false)
  const hoveringRef = useRef(false)
  const hoveredIndexRef = useRef(-1)

  const pointerIdRef = useRef<number | null>(null)
  const lastPointerXRef = useRef(0)
  const dragCardRef = useRef<HTMLElement | null>(null)

  const [hoveredAlt, setHoveredAlt] = useState<string | null>(null)

  useGSAP(() => {
    const root = rootRef.current
    const stage = stageRef.current

    if (!root || !stage || images.length === 0) return

    const cards = gsap.utils.toArray<HTMLElement>(".bezier-card", root)
    const hoverAmounts = new Float32Array(cards.length)
    const count = cards.length

    const cubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
      const oneMinusT = 1 - t
      return oneMinusT * oneMinusT * oneMinusT * p0 + 3 * oneMinusT * oneMinusT * t * p1 + 3 * oneMinusT * t * t * p2 + t * t * t * p3
    }

    const getPathPoint = (t: number) => {
      const width = root.clientWidth
      const height = root.clientHeight

      const x = cubicBezier(t, -0.2 * width, 0.2 * width, 0.6 * width, 1 * width)
      const y = cubicBezier(t, 0.40 * height, 0.48 * height, 0.36 * height, 0.04 * height)

      return { x, y }
    }

    const getWrapped = (value: number) => {
      const result = value % 1
      return result < 0 ? result + 1 : result
    }

    const render = () => {
      visualPhaseRef.current += (phaseRef.current - visualPhaseRef.current) * VISCOUS_LERP

      const phase = visualPhaseRef.current

      cards.forEach((card, index) => {
        const rawT = (index / count) * CARD_SPACING - phase
        const t = getWrapped(rawT)
        const point = getPathPoint(t)

        const nextT = getWrapped(t + 0.002)
        const nextPoint = getPathPoint(nextT)

        const dx = nextPoint.x - point.x
        const dy = nextPoint.y - point.y
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI)

        const depth = Math.sin(t * Math.PI) * 0.35
        const baseScale = 0.94 + depth * 0.08

        const hoverTarget = index === hoveredIndexRef.current ? 1 : 0

        hoverAmounts[index] += (hoverTarget - hoverAmounts[index]) * HOVER_LERP

        const hoverAmount = hoverAmounts[index]

        gsap.set(card, {
          x: point.x,
          y: point.y - hoverAmount * HOVER_LIFT,
          rotation: rotation * 0.08,
          scale: baseScale * (1 + hoverAmount * (HOVER_SCALE - 1)),
          zIndex: Math.round(t * 1000),
        })
      })
    }

    const tick = () => {
      const shouldMove = !hoveringRef.current && !draggingRef.current

      if (shouldMove) {
        phaseRef.current += velocityRef.current
        velocityRef.current += (AUTO_SPEED - velocityRef.current) * 0.035
      } else if (!draggingRef.current) {
        velocityRef.current += (0 - velocityRef.current) * 0.12
      }

      render()
    }

    gsap.ticker.add(tick)
    render()

    const handleCardEnter = (event: Event) => {
      const card = event.currentTarget as HTMLElement
      const index = cards.indexOf(card)

      hoveringRef.current = true
      hoveredIndexRef.current = index
      setHoveredAlt(card.dataset.alt ?? null)
    }

    const handleCardLeave = (event: Event) => {
      const card = event.currentTarget as HTMLElement
      const index = cards.indexOf(card)

      if (hoveredIndexRef.current === index && !draggingRef.current) {
        hoveringRef.current = false
        hoveredIndexRef.current = -1
        setHoveredAlt(null)
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement

      draggingRef.current = true
      hoveringRef.current = false
      hoveredIndexRef.current = -1
      setHoveredAlt(null)

      pointerIdRef.current = event.pointerId
      lastPointerXRef.current = event.clientX
      dragCardRef.current = card

      velocityRef.current = 0

      card.setPointerCapture(event.pointerId)
      card.style.cursor = "grabbing"

      event.preventDefault()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return

      const deltaX = event.clientX - lastPointerXRef.current

      lastPointerXRef.current = event.clientX

      phaseRef.current -= deltaX * DRAG_SPEED
      velocityRef.current = -deltaX * DRAG_SPEED
    }

    const finishDrag = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return

      const card = dragCardRef.current

      draggingRef.current = false
      pointerIdRef.current = null
      dragCardRef.current = null

      if (card?.hasPointerCapture(event.pointerId)) {
        card.releasePointerCapture(event.pointerId)
      }

      if (card) {
        card.style.cursor = "grab"
      }

      hoveringRef.current = false
    }

    const handleResize = () => {
      render()
    }

    window.addEventListener("resize", handleResize)

    cards.forEach((card) => {
      card.addEventListener("pointerenter", handleCardEnter)
      card.addEventListener("pointerleave", handleCardLeave)
      card.addEventListener("pointerdown", handlePointerDown)
      card.addEventListener("pointermove", handlePointerMove)
      card.addEventListener("pointerup", finishDrag)
      card.addEventListener("pointercancel", finishDrag)
    })

    return () => {
      gsap.ticker.remove(tick)

      window.removeEventListener("resize", handleResize)

      cards.forEach((card) => {
        card.removeEventListener("pointerenter", handleCardEnter)
        card.removeEventListener("pointerleave", handleCardLeave)
        card.removeEventListener("pointerdown", handlePointerDown)
        card.removeEventListener("pointermove", handlePointerMove)
        card.removeEventListener("pointerup", finishDrag)
        card.removeEventListener("pointercancel", finishDrag)
      })
    }
  }, [])

  if (images.length === 0) return null

  const renderedImages = Array.from({ length: images.length * COPIES }, (_, index) => ({
    ...images[index % images.length],
    key: `${images[index % images.length].src}-${index}`,
  }))

  return (
    <div ref={rootRef} className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      <div ref={stageRef} className="absolute inset-0 pointer-events-none touch-none select-none">
        {renderedImages.map((image) => (
          <div key={image.key} data-alt={image.alt} className="bezier-card pointer-events-auto absolute left-0 top-0 size-40 shrink-0 cursor-grab overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl will-change-transform touch-none select-none sm:size-48 md:size-56 lg:size-64">
            <Image src={image.src} alt={image.alt} height={200} width={200} unoptimized draggable={false} className="pointer-events-none size-full select-none object-cover" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap text-center">
        <p className="text-sm font-light tracking-wider text-white/70 transition-opacity duration-300">{hoveredAlt ?? ""}</p>
      </div>
    </div>
  )
}
