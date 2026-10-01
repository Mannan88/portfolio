"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { assetPath } from "@/lib/path"

interface BlogSection {
  heading: string
  body: string
}

interface BlogPostProps {
  title: string
  tagline?: string
  date: string
  url?: string
  images: string[]
  content: BlogSection[]
  creditsDetail?: string
  creditsUrl?: string
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

export default function BlogPost({ title, tagline, date, url, images, content, creditsDetail, creditsUrl }: BlogPostProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } })

      tl.fromTo(".blog-back", { y: -20, opacity: 0 }, { y: 0, opacity: 1 })
        .fromTo(".blog-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.5")
        .fromTo(".blog-meta", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.5")
        .fromTo(".blog-image", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12 }, "-=0.4")
        .fromTo(".blog-section", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12 }, "-=0.5")
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="font-light mx-auto w-full max-w-4xl px-4 py-16 sm:px-8">
      <Link href="/#creations" className="blog-back group inline-flex items-center gap-2 opacity-80 transition-opacity duration-300 hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:-translate-x-1">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-light tracking-wide">Back</span>
      </Link>

      <header className="mt-10">
        <h1 className="blog-title text-4xl font-normal leading-tight sm:text-5xl">{title}</h1>

        <div className="blog-meta mt-4 flex flex-wrap items-center gap-4 opacity-60">
          <span className="text-md">{formatDate(date)}</span>
          {tagline && <span className="text-md">— {tagline}</span>}
        </div>

        {url && (
         <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex items-center gap-2 border-b pb-1 text-sm tracking-wide transition-all duration-300 hover:gap-3"
          >
            <span>Visit project</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </header>

      {images.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((src, index) => (
            <div key={index} className={`blog-image relative aspect-video overflow-hidden rounded-xl ${index === 0 ? "sm:col-span-2" : ""}`}>
              <Image   src={assetPath(src)} alt={`${title} snapshot ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-10">
        {content.map((section) => (
          <section key={section.heading} className="blog-section">
            <h2 className="text-2xl font-normal">{section.heading}</h2>
            <p className="mt-4 leading-relaxed text-lg tracking-wider opacity-80 whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </div>
      <div>
        {creditsDetail &&  <p className="mt-4 leading-relaxed text-lg tracking-wider opacity-80">Huge credit to Maxime Heckel for inspiration of the background. Check out the related <span className="pointer-events-auto hover:underline"><a target="_blank" href={creditsUrl}>article</a></span>.</p>}
      </div>
    </div>
  )
}
