"use client";

import { useEffect, useRef, useState } from "react";

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn"] as const;

const COMMANDS: Record<string, () => string> = {
  help: () => `
    <div class="grid grid-cols-[100px_1fr] gap-2 mt-2">
      <span class="syntax-function">about</span>   <span class="text-gray-400">Read my bio</span>
      <span class="syntax-function">skills</span>  <span class="text-gray-400">View tech stack</span>
      <span class="syntax-function">contact</span> <span class="text-gray-400">Get my email</span>
      <span class="syntax-function">clear</span>   <span class="text-gray-400">Clear terminal</span>
    </div>
    <div class="syntax-comment mt-2">// Common dev commands also supported (try 'build', 'test', 'lint'...)</div>
  `,
  about: () => `
    <div class="mt-2 leading-relaxed">
      Hi, I'm <span class="syntax-keyword">Mannan</span>.<br>
      I'm a final year engineering student at Atharva College, Mumbai.<br>
      I specialize in <span class="syntax-string">"Design Engineering"</span>—bridging the gap between static design and interactive code.<br>
      I love building complex UI architectures and butter-smooth GSAP animations.
    </div>
  `,
  skills: () => `
    <div class="mt-2">
      <span class="syntax-keyword">const</span> <span class="syntax-function">stack</span> = [
        <span class="syntax-string">"React"</span>, <span class="syntax-string">"Next.js"</span>, <span class="syntax-string">"TypeScript"</span>,
        <span class="syntax-string">"GSAP"</span>, <span class="syntax-string">"Three.js"</span>, <span class="syntax-string">"Tailwind"</span>
      ];
    </div>
  `,
  contact: () => `
    <div class="mt-2">
      Email: <a href="mailto:hello@mannan.dev" class="text-white hover:underline">hello@mannan.dev</a><br>
      LinkedIn: <a href="#" class="text-white hover:underline">/in/mannankochar</a>
    </div>
  `,
  // New Funny Commands
  start: () => `
    <div class="text-cyan-400 mt-2">
      > Starting development server...<br>
      > Port 3000 is in use...<br>
      > Port 3001 is in use...<br>
      > Port 3002 is in use...<br>
      <span class="text-gray-400">Did you leave 14 terminal tabs open again?</span>
    </div>
  `,
  build: () => `
    <div class="text-yellow-400 mt-2">
      Building production optimized bundle...<br>
      ████████████████████████░░ 99%<br>
      <span class="text-red-500 font-bold">Failed to compile.</span><br>
      <span class="text-red-400">Error: 'any' is not assignable to type 'never'.</span><br>
      <span class="text-gray-400">// Time to go to StackOverflow.</span>
    </div>
  `,
  test: () => `
    <div class="text-green-400 mt-2">
      ✓ 42 tests passed.<br>
      <span class="text-gray-400">(Don't look too closely, they are all 'expect(true).toBe(true)')</span>
    </div>
  `,
  lint: () => `
    <div class="text-red-500 mt-2">
      ✖ 8,342 problems (8,342 errors, 0 warnings)<br>
      <span class="text-gray-400">...Let's just pretend we didn't see that. *adds // eslint-disable-next-line*</span>
    </div>
  `,
  format: () => `
    <div class="text-green-400 mt-2">
      Prettier ran successfully.<br>
      <span class="text-gray-400">You now have 348 file changes in Git. Oops.</span>
    </div>
  `,
  sudo: () => `
    <div class="text-red-500 mt-2">
      Nice try. You are not in the sudoers file.<br>
      This incident will be reported to Santa.
    </div>
  `,
  "rm -rf /": () => `
    <div class="text-red-500 font-bold mt-2 animate-pulse">
      PLEASE DON'T. I LIVE HERE.
    </div>
  `,
  sleep: () =>
    ` <div class="text-blue-400 mt-2">
    zzz...zzz...zzz...zzz...
    </div>`
};

type Line =
  | { id: number; type: "command"; pm: string; raw: string }
  | { id: number; type: "result"; html: string };

export default function Curious() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [pmIndex, setPmIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [glow, setGlow] = useState<"pink" | "cyan" | null>(null);
  const [doodlePeek, setDoodlePeek] = useState(false);

  // Use a ref for ID to avoid SSR hydration mismatches
  const lineIdRef = useRef(1);
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, type: "result", html: `Type <span class="syntax-keyword">'help'</span> to see available commands.` },
  ]);

  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useRef(false);
  const runDevCount = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const glowTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doodleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pm = PACKAGE_MANAGERS[pmIndex];

  // Intersection Observer to track if the section is in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSectionInView.current = entry.isIntersecting;
      },
      { threshold: 0.1 } // Triggers when at least 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // ONLY run if the section is currently visible to the user
      if (!isSectionInView.current) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setTerminalOpen((prev) => (prev ? prev : true));
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (terminalOpen) {
      const t = setTimeout(() => setAnimateIn(true), 200);
      return () => clearTimeout(t);
    } else {
      setAnimateIn(false);
    }
  }, [terminalOpen]);

  useEffect(() => {
    if (terminalOpen) inputRef.current?.focus();
  }, [terminalOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    return () => {
      if (glowTimeout.current) clearTimeout(glowTimeout.current);
      if (doodleTimeout.current) clearTimeout(doodleTimeout.current);
    };
  }, []);

  function print(line: Omit<Line, "id">) {
    const newId = lineIdRef.current++;
    setLines((prev) => [...prev, { ...line, id: newId } as Line]);
  }

  function triggerGlow(type: "pink" | "cyan") {
    if (glowTimeout.current) clearTimeout(glowTimeout.current);
    setGlow(null);
    requestAnimationFrame(() => setGlow(type));
    glowTimeout.current = setTimeout(() => setGlow(null), 1500);
  }

  function triggerDoodle() {
    if (doodleTimeout.current) clearTimeout(doodleTimeout.current);
    setDoodlePeek(true);
    doodleTimeout.current = setTimeout(() => setDoodlePeek(false), 2000);
  }

  function processCommand(cmd: string) {
    if (cmd === "run dev" || cmd === "dev") {
      runDevCount.current += 1;
      if (runDevCount.current >= 5) {
        print({
          type: "result",
          html: `<span class="syntax-string mt-2 block">Warning: Mannan is extremely tired. Please consider 'sleep'.</span>`
        });
        triggerGlow("pink");
        triggerDoodle();
      } else {
        print({
          type: "result",
          html: `<span class="syntax-keyword mt-2 block">Success:</span> Mannan ran ${runDevCount.current}km.`
        });
        triggerGlow("cyan");
      }
      return;
    }

    if (cmd === "i" || cmd === "install") {
      print({
        type: "result",
        html: `
          <div class="text-gray-400 mt-2">
            > Fetching resume.pdf...<br>
            > Extracting skills...<br>
            <span class="syntax-keyword">Done!</span>
            <a href="#" class="syntax-string underline ml-2">Click here to download</a>
          </div>
        `,
      });
      triggerGlow("cyan");
      return;
    }

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "sleep") {
      runDevCount.current = 0;
}
    if (COMMANDS[cmd]) {
      print({ type: "result", html: COMMANDS[cmd]() });
      triggerGlow("cyan");
    } else {
      print({ type: "result", html: `<span class="text-red-500 mt-2 block">Error:</span> Command '${cmd}' not found. Type 'help' for options.` });
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    const rawInput = inputValue.trim();
    const isJustPm = rawInput === "";
    const commandToProcess = isJustPm ? pm : rawInput.toLowerCase();

    setInputValue("");

    print({ type: "command", pm, raw: rawInput });

    if (!commandToProcess && !isJustPm) return;
    processCommand(commandToProcess);
  }

  function cyclePackageManager() {
    setPmIndex((i) => (i + 1) % PACKAGE_MANAGERS.length);
    inputRef.current?.focus();
  }

  return (
    <section ref={sectionRef} id="curious" className="w-full h-dvh flex flex-col items-center p-6 md:p-12">
      <div className="flex flex-col w-fit mx-auto mt-8 relative">
        <span className="hero-subtitle text-sm font-medium text-[#f4f4f4]">MYSELF,</span>
        <h1 className=" text-3xl font-normal md:text-8xl  text-[#f4f4f4]">
          MANNAN KOCHAR
        </h1>
        <span className="font-medium text-sm text-[#f4f4f4] self-end mt-1">
          [ CREATIVE DEVELOPER // MUMBAI ]
        </span>
      </div>

      {!terminalOpen && (
        <div className="flex flex-col items-center gap-4 transition-opacity duration-300 mt-16">
          <p className="text-sm text-[#f4f4f4]">Want to know more?</p>
          <button
            onClick={() => setTerminalOpen(true)}
            className="cmd-button font-mono px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            Press <kbd className="bg-[#222] px-2 py-1 rounded text-xs border border-[#444]">Ctrl</kbd> +{" "}
            <kbd className="bg-[#222] px-2 py-1 rounded text-xs border border-[#444]">K</kbd>
          </button>
        </div>
      )}

      {terminalOpen && (
        <div className="terminal-wrapper mt-16 w-full max-w-3xl">
          <div className={`easter-egg-doodle flex items-center justify-center font-bold text-black text-xs ${doodlePeek ? "peek" : ""}`}>
            O_O
          </div>

          <div
            className={`terminal-container font-mono text-sm transition-all duration-400 ease-out ${
              glow ? `glow-${glow}` : ""
            }`}
            style={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <div className="crt-overlay" />
            <div className="glass-glare" />

            <div className="terminal-screen rounded-lg overflow-hidden border border-[#333] shadow-2xl">
              <div className="h-8 border-b border-[#333] flex items-center px-4 gap-2 bg-[#050505] relative z-30">
                <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setTerminalOpen(false)} />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-auto text-xs text-gray-600">guest@mannan: ~</span>
              </div>

              <div
                ref={outputRef}
                onClick={() => window.getSelection()?.toString() === "" && inputRef.current?.focus()}
                className="terminal-body relative z-30 faulty-crt h-100 overflow-y-auto bg-[#0a0a0a] p-4 text-gray-300 scroll-smooth"
              >
                {lines.map((line) =>
                  line.type === "command" ? (
                    <div key={line.id} className="input-row flex gap-2 mt-4">
                      <span className="prompt-symbol text-green-400">❯</span>
                      <span className="text-gray-500">{line.pm}</span>
                      <span className="text-white">{line.raw}</span>
                    </div>
                  ) : (
                    <div key={line.id} className="mb-2" dangerouslySetInnerHTML={{ __html: line.html }} />
                  )
                )}
              </div>

              <div className="border-t border-[#333] p-3 px-4 bg-[#050505] flex items-center relative z-30 faulty-crt">
                <span className="prompt-symbol mr-2 text-green-400">❯</span>
                <span
                  onClick={cyclePackageManager}
                  className="text-gray-500 mr-2 select-none cursor-pointer hover:text-white transition-colors"
                  title="Click to change package manager"
                >
                  {pm}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="terminal-input bg-transparent border-none outline-none flex-1 text-white placeholder-gray-700"
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
