"use client"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { SOCIALS } from "@/data/socials"
import Image from "next/image"
import Link from "next/link"
import BezierCarousel from "./BeizerCarousel"
import { assetPath } from "@/lib/path"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Callme() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {

      const tl = gsap.timeline({
        defaults: { duration: 0.9, ease: "power3.out" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })

      tl.fromTo(".contact-title", { x: -80, opacity: 0 }, { x: 0, opacity: 1 })
        .fromTo(".contact-location", { x: 80, opacity: 0 }, { x: 0, opacity: 1 }, "<")
        .fromTo(
          ".social-item",
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.08 },
          "-=0.4"
        )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full min-h-dvh  text-white overflow-hidden"
    >
      <div className="absolute inset-0">
        <BezierCarousel/>
      </div>
   <div className="relative z-10 flex flex-col justify-between h-full min-h-dvh px-8 py-8 pointer-events-none">
        <div className="flex items-start justify-between gap-4">
          <h2 className="contact-title max-w-2xl text-6xl font-normal leading-none tracking-wide">
            let&apos;s build cool sh*t together
          </h2>
<Link href={"/behind-the-scenes"}>
          <span className="group contact-location flex items-center justify-center gap-0 shrink-0 text-lg font-light tracking-wider text-white/70 pointer-events-auto pl-8 pb-8">

            <span className="flex size-6 shrink-0 items-center justify-center">
              <Image
                 src={assetPath("/info-circle.svg")}
                alt="behind the scenes"
                width={20}
                height={20}
                className="size-6"
              />
            </span>

            <span
              className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 -translate-x-2 transition-all duration-300 ease-out
                group-hover:max-w-24 group-hover:ml-2 group-hover:translate-x-0 group-hover:opacity-100">
              Read BTS
            </span>
          </span>
</Link>
        </div>

        <div className="flex items-end justify-end gap-4">
          <ul className="flex flex-col items-end gap-4 pointer-events-auto">
            {SOCIALS.map((social) => (
              <li key={social.label} className="social-item">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative z-10 flex flex-row-reverse items-center gap-3 border-b border-white/20 pb-1 cursor-pointer transition-colors duration-300"
                  style={{ ["--hover-color" as string]: social.color }}
                >
                  <span className="h-2 w-2 rounded-full bg-[#888888] transition-colors duration-300 group-hover:bg-(--hover-color)" />
                  <span className="text-lg px-2 transition-colors duration-300 group-hover:bg-(--hover-color)">
                    {social.label}
                  </span>
                  {social.note && (
                    <span className="text-sm tracking-wider font-light text-white/60">— {social.note}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
