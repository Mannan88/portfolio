"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SECTIONS = [
  { id: "clouds", label: "Clouds" },
  { id: "curious", label: "Curious?" },
  { id: "craft", label: "Craft" },
  { id: "creations", label: "Creations" },
  { id: "contact", label: "Call me?" }, // Assuming the section ID is "contact"
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // 1. Scroll Progress & Active Section Observer
  useEffect(() => {
    // Scroll Progress
    // Inside your useEffect in Navbar.tsx
    const handleScroll = () => {
      // Use documentElement (the <html> tag) which is more reliable in React
      const scrollElement = document.documentElement || document.body;
      const scrollPos = window.scrollY || scrollElement.scrollTop;
      const totalHeight = scrollElement.scrollHeight - window.innerHeight;

      if (totalHeight > 0) {
        const currentProgress = (scrollPos / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, Math.round(currentProgress))));
      } else {
        setProgress(0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init

    // Intersection Observer for Active Section
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that is currently intersecting the most
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // Triggers when section hits the middle of the screen
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // 2. GSAP Reveal Animation
  useGSAP(() => {
    // Initial hidden state for items
    gsap.set(itemsRef.current, {
      y: 20,
      x: -20,
      opacity: 0,
      rotateX: 45,
      pointerEvents: "none",
    });

    // Create the timeline
    tl.current = gsap
      .timeline({ paused: true })
      .to(itemsRef.current, {
        y: 0,
        x: 0,
        opacity: 1,
        rotateX: 0,
        pointerEvents: "auto",
        stagger: -0.06, // Animates from bottom to top
        duration: 0.5,
        ease: "back.out(1.2)",
      });
  }, { scope: containerRef });

  // Play/Reverse timeline on toggle
  useEffect(() => {
    if (isOpen) tl.current?.play();
    else tl.current?.reverse();
  }, [isOpen]);

  // 3. Hover Animations (using contextSafe for GSAP reactivity)
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    const text = e.currentTarget.querySelector(".nav-text");
    const dot = e.currentTarget.querySelector(".nav-dot");

    gsap.to(text, { x: 10, color: "#fff", duration: 0.3, ease: "power2.out" });
    gsap.to(dot, { scale: 1, opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)" });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    const text = e.currentTarget.querySelector(".nav-text");
    const dot = e.currentTarget.querySelector(".nav-dot");
    // Only revert if it's NOT the active section
    if (e.currentTarget.dataset.active === "false") {
      gsap.to(text, { x: 0, color: "#888", duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0, opacity: 0, x: -10, duration: 0.3, ease: "power2.in" });
    }
  });

  // 4. Scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // Close nav after clicking
    }
  };

  // SVG Circle calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 left-8 z-100 flex flex-col-reverse items-start gap-4 font-mono perspective-1000"
    >
      {/* --- Toggle Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-16 h-16 bg-[#0a0a0a] border border-[#333] rounded-full text-white shadow-2xl hover:border-gray-500 transition-colors duration-300"
        aria-label="Toggle Navigation"
      >
        {/* SVG Circular Progress Bar */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#1a1a1a"
            strokeWidth="2"
            fill="none"
          />
          {/* Progress Indicator */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#00e5ff" // Your Cyan accent color
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
        </svg>

        <span className="text-sm font-bold z-10">
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            `${progress}%`
          )}
        </span>
      </button>

      {/* --- Expanding Nav Items --- */}
      <div className="flex flex-col gap-3 ml-2 mb-2">
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
              className="group relative flex items-center gap-3 text-left w-max overflow-hidden"
            >
              {/* Animated SVG Dot */}
              <div
                className={`nav-dot w-2 h-2 rounded-full bg-[#ff2a7a] absolute left-0`}
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "scale(1) translateX(0)" : "scale(0) translateX(-10px)",
                  transition: isActive ? "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none"
                }}
              />

              {/* Text */}
              <span
                className={`nav-text text-sm font-bold tracking-widest uppercase transition-colors duration-300`}
                style={{
                  transform: isActive ? "translateX(10px)" : "translateX(0px)",
                  color: isActive ? "#ffffff" : "#888888"
                }}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
