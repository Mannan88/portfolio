// components/.../Terminal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn"] as const;

// VIBGYOR, used across commands instead of a single accent pair —
// each command family gets its own color rather than everything
// funneling into one "success" / "error" binary.
export type GlowColor = "violet" | "indigo" | "blue" | "green" | "yellow" | "orange" | "red";

type Line =
  | { id: number; type: "command"; pm: string; raw: string }
  | { id: number; type: "result"; html: string };

interface TerminalProps {
  onClose: () => void;
  onGlowChange: (type: GlowColor | null) => void;
  onDoodleTrigger: () => void;
}

// Colors a "dev" run cycles through — different each time, rather than
// always landing on the same accent.
const DEV_RUN_COLORS: GlowColor[] = ["green", "blue", "violet"];

export default function Terminal({ onClose, onGlowChange, onDoodleTrigger }: TerminalProps) {
  const [pmIndex, setPmIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const runDevCount = useRef(0);

  const lineIdRef = useRef(1);
  const [lines, setLines] = useState<Line[]>([
    { id: 0, type: "result", html: `Type <span class="syntax-keyword">'help'</span> to see available commands or <span class="syntax-function">'build'</span>.` },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const pm = PACKAGE_MANAGERS[pmIndex];

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  function print(line: Omit<Line, "id">) {
    const newId = lineIdRef.current++;
    setLines((prev) => [...prev, { ...line, id: newId }]);
  }

  function updateLine(id: number, newHtml: string) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, html: newHtml } : l)));
  }

  function processCommand(cmd: string) {
    if (cmd === "clear") {
      setLines([]);
      onGlowChange(null);
      return;
    }

    if (cmd === "help") {
      print({
        type: "result",
        html: `
          <div class="grid grid-cols-[100px_1fr] gap-2 mt-2">
            <span class="syntax-function">about</span>   <span class="text-gray-400">Read my bio</span>
            <span class="syntax-function">skills</span>  <span class="text-gray-400">View tech stack</span>
            <span class="syntax-function">contact</span> <span class="text-gray-400">Socials</span>
            <span class="syntax-function">clear</span>   <span class="text-gray-400">Clear terminal</span>
            <span class="text-slate-500 w-200">you can also try standard npm commands :D</span>
          </div>
        `,
      });
      onGlowChange("blue");
      return;
    }

    if (cmd === "about") {
      print({
        type: "result",
        html: `
          <div class="mt-2 leading-relaxed">
            Hi, I'm <span class="syntax-keyword">Mannan</span>.<br>
            I'm a final year engineering student at Atharva College, Mumbai.<br>
            I specialize in <span class="syntax-string">Design Engineering</span>, which is to bridge the gap between static design and interactive code.<br>
            I love building complex UI architectures and butter-smooth GSAP animations. My hobbies revolve around creatives and doodles, and I strive to channel my creativity into my work.
          </div>
        `,
      });
      onGlowChange("indigo");
      return;
    }

    if (cmd === "skills") {
      print({
        type: "result",
        html: `
          <div class="mt-2">
            <span class="syntax-keyword">const</span> <span class="syntax-function">stack</span> = [<span class="syntax-string">"Next.js"</span>, <span class="syntax-string">"ReactJS"</span>, <span class="syntax-string">"TypeScript"</span>,
              <span class="syntax-string">"GSAP"</span>, <span class="syntax-string">"Three.js"</span>, <span class="syntax-string">"Tailwind"</span>, <span class="syntax-string">"Figma & Canva"</span>
            ];
          </div>
        `,
      });
      onGlowChange("violet");
      return;
    }

    if (cmd === "contact") {
      print({
        type: "result",
        html: `
          <div class="mt-2">
            Email: <a target="_blank" href="mailto:kocharmanan88@gmail.com" class="text-white hover:underline">kocharmanan88@gmail.com</a>
            <br>
            LinkedIn: <a target="_blank" href="https://www.linkedin.com/in/mannan-kochar-74bb75270/" class="text-white hover:underline">Mannan Kochar</a>
            <br>
            Github: <a target="_blank" href="https://www.github.com/Mannan88" class="text-white hover:underline">Mannan88</a>
          </div>
        `,
      });
      onGlowChange("green");
      return;
    }

    // Dynamic multi-step build simulation — kept, since a failing build with
    // a real reason is a decent joke on its own without needing test/lint too.
    if (cmd === "build") {
      print({
        type: "result",
        html: `<div class="text-yellow-400 mt-2">> Building production optimized bundle...</div>`,
      });
      onGlowChange("yellow");

      const progressId = lineIdRef.current++;
      setLines((prev) => [...prev, { id: progressId, type: "result", html: `[░░░░░░░░░░] 0% compiling...` }]);

      setTimeout(() => {
        updateLine(progressId, `[████░░░░░░] 42% optimizing chunks...`);
      }, 600);

      setTimeout(() => {
        updateLine(progressId, `[█████████░] 99% generating static pages...`);
      }, 1400);

      setTimeout(() => {
        onGlowChange("red");
        print({
          type: "result",
          html: `
            <div class="text-red-400 mt-2 font-mono">
              <span class="text-red-500 font-bold">Failed to compile.</span><br>
              Error: Type 'any' is not assignable to type 'never'.<br>
              <span class="text-gray-500">// We love Typescript don't we :).</span>
            </div>
          `,
        });
      }, 2200);
      return;
    }

    if (cmd === "run dev" || cmd === "dev") {
      runDevCount.current += 1;

      if (runDevCount.current >= 4) {
        print({
          type: "result",
          html: `<span class="syntax-string mt-2 block">Warning: Mannan is exhausted. He needs 'sleep'.</span>`,
        });
        onGlowChange("orange");
        onDoodleTrigger();
      } else {
        const color = DEV_RUN_COLORS[(runDevCount.current - 1) % DEV_RUN_COLORS.length];
        print({
          type: "result",
          html: `<span class="syntax-keyword mt-2 block">Success:</span> Mannan ran ${runDevCount.current}km(s).`,
        });
        onGlowChange(color);
      }
      return;
    }

    if (cmd === "sleep" || cmd === "npm run sleep") {
      runDevCount.current = 0;
      print({
        type: "result",
        html: `Mannan is sleeping.<span class="syntax-function mt-2 block">Zzz...</span>`,
      });

      setTimeout(() => {
        print({
          type: "result",
          html: `<span class="syntax-function mt-2 block">Zzz...Zzz...</span>`,
        });
      }, 600);

      setTimeout(() => {
        print({
          type: "result",
          html: `<span class="syntax-function mt-2 block">Zzz...Zzz...Zzz...</span>`,
        });
      }, 1400);
      setTimeout(() => {
        print({
          type: "result",
          html: `<span class="syntax-function mt-2 block">He sure loves sleeping.</span>`,
        });
      }, 2400);

      onGlowChange("indigo");
      return;
    }

    // Default error fallback
    print({
      type: "result",
      html: `<span class="text-red-500 mt-2 block">Error:</span> Command '${cmd}' not recognized. Type 'help'.`,
    });
    onGlowChange("red");
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
    <div className="terminal-screen rounded-lg overflow-hidden border border-[#333] shadow-2xl bg-black">
      <div className="h-8 border-b border-[#333] flex items-center px-4 gap-2 bg-[#050505] relative z-30">
        <div
          className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-400 transition-colors"
          onClick={onClose}
          title="Close terminal"
        />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-auto text-xs text-gray-600">guest@mannan: ~</span>
      </div>

      <div
        ref={outputRef}
        onClick={() => window.getSelection()?.toString() === "" && inputRef.current?.focus()}
        className="terminal-body relative z-30 faulty-crt h-[360px] overflow-y-auto bg-[#0a0a0a] p-4 text-gray-300 scroll-smooth"
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
          className="terminal-input bg-transparent border-none outline-none flex-1 text-white placeholder-gray-700 font-mono text-sm"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
