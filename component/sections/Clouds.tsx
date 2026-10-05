"use client";

import Sprite from "../hero/SpriteTemplate";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
const SCALE = 8;

export default function Clouds() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".portfolio-letter");
      const paragraph = ".clouds-copy";

      gsap.fromTo(
        letters,
        {
          y: 100,
          opacity: 0,
          rotation: 8,
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        }
      );

      gsap.fromTo(
        paragraph,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 1,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clouds"
      className="w-full min-h-dvh [--s:5] [--crop:1] md:[--s:4] md:[--crop:0] lg:[--s:8]"
    >
      <div className="mt-16 md:mt-24 grid grid-cols-[repeat(3,max-content)] justify-center gap-y-4 md:flex md:justify-center md:gap-0 md:items-center">
        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-p-v2.webp"
            frameCount={35}
            nativeWidth={19}
            nativeHeight={64}
            scale={SCALE}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-o.webp"
            frameCount={48}
            nativeWidth={18}
            nativeHeight={64}
            scale={SCALE}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-r.webp"
            frameCount={38}
            nativeWidth={20}
            nativeHeight={64}
            scale={SCALE}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-t.webp"
            frameCount={40}
            nativeWidth={20}
            nativeHeight={64}
            scale={SCALE}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-f-v2.webp"
            frameCount={24}
            nativeWidth={23}
            nativeHeight={64}
            scale={SCALE}
            zIndex={50}
            duration={3}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-o.webp"
            frameCount={48}
            nativeWidth={18}
            nativeHeight={64}
            scale={SCALE}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-l.webp"
            frameCount={62}
            nativeWidth={19}
            nativeHeight={64}
            scale={SCALE}
            zIndex={50}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-i.webp"
            frameCount={30}
            nativeWidth={14}
            nativeHeight={64}
            scale={SCALE}
            duration={2.4}
          />
        </div>

        <div className="portfolio-letter">
          <Sprite
            src="/section_one_letters/letter-o.webp"
            frameCount={48}
            nativeWidth={18}
            nativeHeight={64}
            scale={SCALE}
          />
        </div>
      </div>

      <div className="sm:flex hidden justify-end mt-12 px-8 md:px-20">
        <p className="clouds-copy text-xs text-justify text-[#c1c1c1] uppercase max-w-70 font-light tracking-wider">
          [ REF // MANIFESTO ] — 2026 // WHILE THE
          ENVIRONMENT OPTIMIZES FOR STANDARDIZED LABOUR, MASS-RECRUITER LOOPS, AND GENERIC API WRAPPERS, MY CORE OBJECTIVE REMAINS COMPLETELY UNCHANGED. LET THE NOISE DICTATE THE BASELINE; I WORK IN THE EXCEPTIONS. ENGINEERING HIGH-FIDELITY INTERACTION, CUSTOM SHADERS, AND DIGITAL ATMOSPHERE ISN&apos;T A VARIABLE DEPENDENT
          ON MARKET INDEXES OR INFRASTRUCTURE TRENDS; IT IS A NON-NEGOTIABLE CONSTANT. REGARDLESS OF THE STATE OF THE ECONOMY, MY GOALS ARE FIXED: I WILL KEEP CREATING COOL SH#T TILL THE END OF TIME.
        </p>
      </div>
    </section>
  );
}
