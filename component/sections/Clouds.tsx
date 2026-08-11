import Sprite from "../hero/SpriteTemplate";
const SCALE = 8
export default function Clouds() {
  return (
    <section id="clouds" className="w-full h-dvh">
      <div className="flex items-center mt-24 w-full justify-center">
        {/* Normal 32x64 Letters */}
        <Sprite src="/section_one_letters/letter-p.webp" frameCount={35} nativeWidth={18} nativeHeight={64} scale={SCALE}  />
        <Sprite src="/section_one_letters/letter-o.webp" frameCount={48} nativeWidth={18} nativeHeight={64} scale={SCALE} />
        <Sprite src="/section_one_letters/letter-r.webp" frameCount={38} nativeWidth={20} nativeHeight={64} scale={SCALE} />
        <Sprite src="/section_one_letters/letter-t.webp" frameCount={40} nativeWidth={20} nativeHeight={64} scale={SCALE} />
        <Sprite src="/section_one_letters/letter-f-v2.webp" frameCount={24} nativeWidth={23} nativeHeight={64} scale={SCALE} zIndex={50} duration={3} />
        <Sprite src="/section_one_letters/letter-o.webp" frameCount={48} nativeWidth={18} nativeHeight={64} scale={SCALE} />
        <Sprite src="/section_one_letters/letter-l.webp" frameCount={62} nativeWidth={19} nativeHeight={64} scale={SCALE} zIndex={50} />
        <Sprite src="/section_one_letters/letter-i.webp" frameCount={30} nativeWidth={14} nativeHeight={64} scale={SCALE} duration={2.4} />
        <Sprite src="/section_one_letters/letter-o.webp" frameCount={48} nativeWidth={18} nativeHeight={64} scale={SCALE} />
      </div>
      <div className="flex justify-end mt-12 px-20">
        <p className="text-xs text-justify text-[#c1c1c1] uppercase max-w-70  font-light tracking-wider">[ REF // 01_INIT_MANIFESTO ] — SYSTEM UPDATE: 2026 // WHILE THE MACRO ENVIRONMENT OPTIMIZES FOR STANDARDIZED LABOUR, MASS-RECRUITER LOOPS, AND GENERIC API WRAPPERS, THE CORE OBJECTIVE REMAINS COMPLETELY UNCHANGED. LET THE NOISE DICTATE THE BASELINE; WE OPERATE EXCLUSIVELY IN THE EXCEPTIONS. ENGINEERING HIGH-FIDELITY INTERACTION, CUSTOM SHADERS, AND DIGITAL ATMOSPHERE ISN&lsquo;T A VARIABLE DEPENDENT ON MARKET INDEXES OR INFRASTRUCTURE TRENDS—IT IS A NON-NEGOTIABLE CONSTANT. REGARDLESS OF THE STATE OF THE ECONOMY, THE MATRIX IS BINARY: INTENTIONAL CRAFTSMANSHIP OR ABSOLUTE VOID. I CHOOSE TO BUILD COOL Sh#T.</p>
      </div>
    </section>
  )
}
