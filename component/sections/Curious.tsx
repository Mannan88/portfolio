"use client";

import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import Terminal from "../Terminal";
import HalftoneBackground from "../backgrounds/halftone-bg/HalfToneBg";

gsap.registerPlugin(useGSAP, Flip);

export default function Curious() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const [glow, setGlow] = useState<"pink" | "cyan" | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const terminalWrapperRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isSectionInView = useRef(false);
  const hasAnimatedIn = useRef(false);
  const terminalOpenRef = useRef(false);
  const glowTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openTerminalRef = useRef<(() => void) | null>(null);
  const closeTerminalRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const targetHeight = terminalContainerRef.current?.offsetHeight;

      const heroElements = heroRef.current?.children;
      const wrapper = terminalWrapperRef.current;

      if (heroElements) {
        gsap.set(heroElements, {
          y: 20,
          opacity: 0,
        });
      }

      if (wrapper) {
        gsap.set(wrapper, {
          height: 0,
          autoAlpha: 0,
          pointerEvents: "none",
        });
      }

      const animateHeroIn = () => {
        if (hasAnimatedIn.current) return;

        const elements = heroRef.current?.children;
        if (!elements) return;

        hasAnimatedIn.current = true;

        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.inOut",
        });
      };

      const openTerminal = () => {
        const button = buttonRef.current;
        const box = terminalContainerRef.current;
        const wrapper = terminalWrapperRef.current;

        if (!button || !box || !wrapper) return;

        const state = Flip.getState(button, {
          props: "borderRadius",
        });

        gsap.to(button.querySelector(".cmd-button-label"), {
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
        });

        flushSync(() => {
          setTerminalOpen(true);
        });

        gsap.set(wrapper, {
          height: "min(500px, 70vh)",
          autoAlpha: 1,
          pointerEvents: "auto",
        });

        Flip.from(state, {
          targets: box,
          duration: 0.6,
          ease: "power3.inOut",
          absolute: true,
          scale: false,
          onComplete: () => {
            setStartTyping(true);
          },
        });

        gsap.to(heroRef.current, {
          scale: 1,
          duration: 0.6,
          ease: "power3.inOut",
        });
      };

      const closeTerminal = () => {
        const box = terminalContainerRef.current;
        const wrapper = terminalWrapperRef.current;

        if (!box || !wrapper) return;

        setStartTyping(false);

        const state = Flip.getState(box, {
          props: "borderRadius",
        });

        flushSync(() => {
          setTerminalOpen(false);
        });

        gsap.set(wrapper, {
          height: 0,
          autoAlpha: 0,
          pointerEvents: "none",
        });

        const button = buttonRef.current;

        if (!button) return;

        Flip.from(state, {
          targets: button,
          duration: 0.6,
          ease: "power3.inOut",
          absolute: true,
          scale: false,
          onStart: () => {
            const label = button.querySelector(".cmd-button-label");

            if (label) {
              gsap.fromTo(
                label,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.6,
                  delay: 0.2,
                }
              );
            }
          },
        });

        gsap.to(heroRef.current, {
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.inOut",
        });
      };

      openTerminalRef.current = openTerminal;
      closeTerminalRef.current = closeTerminal;

      const observer = new IntersectionObserver(
        ([entry]) => {
          isSectionInView.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            animateHeroIn();
          }
        },
        { threshold: 0.3 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => {
        observer.disconnect();
        openTerminalRef.current = null;
        closeTerminalRef.current = null;
      };
    },
    {
      scope: sectionRef,
    }
  );

  useEffect(() => {
    terminalOpenRef.current = terminalOpen;
  }, [terminalOpen]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isSectionInView.current) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();

        if (terminalOpenRef.current) {
          closeTerminalRef.current?.();
        } else {
          openTerminalRef.current?.();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleGlowChange = (type: "pink" | "cyan" | null) => {
    if (glowTimeout.current) {
      clearTimeout(glowTimeout.current);
    }

    setGlow(null);

    requestAnimationFrame(() => {
      setGlow(type);
    });

    if (type) {
      glowTimeout.current = setTimeout(() => {
        setGlow(null);
      }, 1500);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-dvh flex flex-col gap-8 items-center p-6 md:p-12 mt-8 relative overflow-hidden"
    >
      <div
        ref={heroRef}
        className="flex flex-col items-center text-center relative z-10"
      >
        <span className="hero-subtitle text-start text-xs md:text-sm font-normal text-[#f4f4f4] mb-2">
          MYSELF,
        </span>

        <h1 className="hero-title text-5xl font-normal md:text-8xl text-[#f4f4f4]">
          MANNAN KOCHAR
        </h1>

        <span className="hero-subtitle font-normal text-xs md:text-sm text-[#f4f4f4] mt-2">
          [ CREATIVE DEVELOPER // MUMBAI ]
        </span>

        {!terminalOpen && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-sm text-gray-400 font-mono">
              Want to know more?
            </p>

            <button
              ref={buttonRef}
              data-flip-id="terminal-morph"
              onClick={() => openTerminalRef.current?.()}
              className="cmd-button font-mono px-5 py-2.5 rounded-md text-sm flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span className="cmd-button-label flex items-center gap-2">
                Press{" "}
                <kbd className="bg-[#222] px-2 py-1 rounded text-xs border border-[#444]">
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd className="bg-[#222] px-2 py-1 rounded text-xs border border-[#444]">
                  K
                </kbd>
              </span>
            </button>
          </div>
        )}
      </div>

      <div
        ref={terminalWrapperRef}
        className="terminal-wrapper relative w-full max-w-4xl overflow-hidden z-0 cursor-default"
      >
        <div
          ref={terminalContainerRef}
          data-flip-id="terminal-morph"
          className={`terminal-container w-full max-h-110 relative overflow-hidden font-mono text-sm ${
            glow ? `glow-${glow}` : ""
          }`}
        >
          <div className="crt-overlay" />
          <div className="glass-glare" />

          <Terminal
            onClose={() => closeTerminalRef.current?.()}
            onGlowChange={handleGlowChange}
            onDoodleTrigger={() => {}}
          />
        </div>
      </div>
      <HalftoneBackground gridSize={64} radius={0.12} bgColor="#1e1e1e" dotColor="#717174" />
    </section>
  );
}
