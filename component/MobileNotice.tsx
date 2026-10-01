export default function MobileNotice() {
  return (
    <div className="fixed inset-0 z-999 flex lg:hidden flex-col items-center justify-center gap-4 bg-[#1e1e1e] px-8 text-center text-[#f4f4f4]">
      <span className="font-mono text-xs tracking-widest text-white/50 uppercase">
        [ Work in Progress ]
      </span>

      <p className="max-w-xs text-lg font-light leading-relaxed">
        This site isn&apos;t optimized for mobile yet.
      </p>

      <p className="max-w-xs text-sm font-light text-white/60">
        Please view on a desktop for the best experience.
      </p>
    </div>
  )
}
