"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SECTIONS = [
  { id: "clouds", label: "Clouds", dot: "#460000B" },
  { id: "curious", label: "Curious?", dot: "#22c55e" },
  { id: "craft", label: "Craft", dot: "#3b82f6" },
  { id: "creations", label: "Creations", dot: "#eab308" },
  { id: "contact", label: "Call me?", dot: "#a855f7" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Scroll progress + which section is active.
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement || document.body;
      const total = el.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100))) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: "-40% 0px -40% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Open/close timeline + chrome shimmer.
  useGSAP(
    () => {
      gsap.set(itemsRef.current, { y: 20, x: -20, opacity: 0, rotateX: 45, pointerEvents: "none" });

      tl.current = gsap
        .timeline({ paused: true })
        .to(itemsRef.current, {
          y: 0,
          x: 0,
          opacity: 1,
          rotateX: 0,
          pointerEvents: "auto",
          stagger: -0.06,
          duration: 0.5,
          ease: "back.out(1.2)",
        });

      if (gradientRef.current) {
        gsap.to(gradientRef.current, {
          attr: { gradientTransform: "rotate(360 32 32)" },
          duration: 6,
          repeat: -1,
          ease: "none",
        });
      }
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (isOpen) tl.current?.play();
    else tl.current?.reverse();
  }, [isOpen]);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".nav-dot-inner"), { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.dataset.active !== "true") {
      gsap.to(e.currentTarget.querySelector(".nav-dot-inner"), { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div ref={containerRef} className="fixed z-999 bottom-4 left-4 font-mono perspective-1000">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close Navigation" : "Toggle Navigation"}
        aria-expanded={isOpen}
        className="relative flex items-center justify-center w-16 h-16 bg-[#0a0a0a] border border-[#333] rounded-full text-white shadow-2xl hover:border-gray-500 transition-colors duration-300"
      >
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <defs>
            <linearGradient
              ref={gradientRef}
              id="chromeGradient"
              gradientUnits="userSpaceOnUse"
              x1="8"
              y1="32"
              x2="56"
              y2="32"
              gradientTransform="rotate(0 32 32)"
            >
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="20%" stopColor="#a78bfa" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#34d399" />
              <stop offset="80%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#d4d4d8" />
            </linearGradient>
            <filter id="chromeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="32" cy="32" r={radius} stroke="#1a1a1a" strokeWidth="2" fill="none" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="url(#chromeGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#chromeGlow)"
            className="transition-[stroke-dashoffset] duration-300 ease-out"
          />
        </svg>

        <span className="relative z-10 flex items-center justify-center w-6 h-6">
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <span className="text-sm tracking-widest bg-linear-to-br from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
              MK
            </span>
          )}
        </span>
      </button>

      <div className="absolute bottom-full mb-4 left-0 flex flex-col gap-4 w-max max-w-[calc(100vw-4rem)] items-start">
        {SECTIONS.map((section, index) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              data-active={isActive}
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="group relative flex items-center gap-4 w-max text-left"
            >
              <span className="nav-dot w-4 h-4 flex items-center justify-center shrink-0">
                <span
                  className="nav-dot-inner block w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: section.dot,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </span>
              <span className={`nav-text font-bold text-sm tracking-wider uppercase whitespace-nowrap transition-colors hover:text-[#efefef] duration-300 ${isActive ? "text-[#efefef]" : "text-[#888888]"}`}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
