"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { images } from "@/data/images"
import Image from "next/image"
import { assetPath } from "@/lib/path"

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

const EDGE_MARGIN = 32
const FADE_ZONE = 0.04

const TAP_THRESHOLD = 6
const TAP_REVEAL_MS = 3500

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

  const downXRef = useRef(0)
  const downYRef = useRef(0)
  const movedRef = useRef(0)
  const tappedIndexRef = useRef(-1)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [hoveredAlt, setHoveredAlt] = useState<string | null>(null)

  useGSAP(() => {
    const root = rootRef.current
    const stage = stageRef.current

    if (!root || !stage || images.length === 0) return

    const cards = gsap.utils.toArray<HTMLElement>(".bezier-card", root)
    const hoverAmounts = new Float32Array(cards.length)
    const count = cards.length

    let cardWidth = cards[0]?.offsetWidth ?? 0

    const clearTapReveal = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
      if (tappedIndexRef.current !== -1) {
        tappedIndexRef.current = -1
        setHoveredAlt(null)
      }
    }

    const cubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
      const oneMinusT = 1 - t
      return oneMinusT * oneMinusT * oneMinusT * p0 + 3 * oneMinusT * oneMinusT * t * p1 + 3 * oneMinusT * t * t * p2 + t * t * t * p3
    }

    const getPathPoint = (t: number) => {
      const width = root.clientWidth
      const height = root.clientHeight

      const startX = -(cardWidth + EDGE_MARGIN)
      const endX = width + EDGE_MARGIN
      const span = endX - startX

      const x = cubicBezier(t, startX, startX + span / 3, startX + (span * 2) / 3, endX)
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

        const opacity = Math.min(1, t / FADE_ZONE, (1 - t) / FADE_ZONE)

        gsap.set(card, {
          x: point.x,
          y: point.y - hoverAmount * HOVER_LIFT,
          rotation: rotation * 0.08,
          scale: baseScale * (1 + hoverAmount * (HOVER_SCALE - 1)),
          opacity,
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
      const pe = event as PointerEvent
      if (pe.pointerType !== "mouse") return

      const card = event.currentTarget as HTMLElement
      const index = cards.indexOf(card)

      hoveringRef.current = true
      hoveredIndexRef.current = index
      setHoveredAlt(card.dataset.alt ?? null)
    }

    const handleCardLeave = (event: Event) => {
      const pe = event as PointerEvent
      if (pe.pointerType !== "mouse") return

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

      if (event.pointerType === "mouse") {
        setHoveredAlt(null)
      }

      pointerIdRef.current = event.pointerId
      lastPointerXRef.current = event.clientX
      downXRef.current = event.clientX
      downYRef.current = event.clientY
      movedRef.current = 0
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

      movedRef.current = Math.max(
        movedRef.current,
        Math.hypot(event.clientX - downXRef.current, event.clientY - downYRef.current)
      )

      if (movedRef.current > TAP_THRESHOLD && event.pointerType !== "mouse") {
        clearTapReveal()
      }

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

    const handlePointerUp = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return

      const card = dragCardRef.current
      const isTap = movedRef.current <= TAP_THRESHOLD && event.pointerType !== "mouse"

      finishDrag(event)

      if (!isTap || !card) return

      const index = cards.indexOf(card)

      if (tappedIndexRef.current === index) {
        clearTapReveal()
        return
      }

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

      tappedIndexRef.current = index
      setHoveredAlt(card.dataset.alt ?? null)

      hideTimerRef.current = setTimeout(() => {
        hideTimerRef.current = null
        tappedIndexRef.current = -1
        setHoveredAlt(null)
      }, TAP_REVEAL_MS)
    }

    const handleRootPointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest(".bezier-card")) return
      clearTapReveal()
    }

    const handleResize = () => {
      cardWidth = cards[0]?.offsetWidth ?? 0
      render()
    }

    window.addEventListener("resize", handleResize)
    root.addEventListener("pointerdown", handleRootPointerDown)

    cards.forEach((card) => {
      card.addEventListener("pointerenter", handleCardEnter)
      card.addEventListener("pointerleave", handleCardLeave)
      card.addEventListener("pointerdown", handlePointerDown)
      card.addEventListener("pointermove", handlePointerMove)
      card.addEventListener("pointerup", handlePointerUp)
      card.addEventListener("pointercancel", finishDrag)
    })

    return () => {
      gsap.ticker.remove(tick)

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

      window.removeEventListener("resize", handleResize)
      root.removeEventListener("pointerdown", handleRootPointerDown)

      cards.forEach((card) => {
        card.removeEventListener("pointerenter", handleCardEnter)
        card.removeEventListener("pointerleave", handleCardLeave)
        card.removeEventListener("pointerdown", handlePointerDown)
        card.removeEventListener("pointermove", handlePointerMove)
        card.removeEventListener("pointerup", handlePointerUp)
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
            <Image src={assetPath(image.src)} alt={image.alt} height={200} width={200} unoptimized draggable={false} className="pointer-events-none size-full select-none object-cover" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-50 sm:bottom-30 md:bottom-20 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap text-center">
        <p className="text-sm font-light tracking-wider text-white/70 transition-opacity duration-300">{hoveredAlt ?? ""}</p>
      </div>
    </div>
  )
}
