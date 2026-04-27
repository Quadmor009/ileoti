/** Continue-with-Google area: light frame + Ile Oti red logo (SVGs scale; share a 2–3× PNG only if it looks soft). */
export function OauthLogoSlot({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="w-[160px] h-[62px] rounded-[22px] bg-white border border-[#E5E5E5] flex items-center justify-center px-3 shadow-sm"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img src="/logos/red-logo.svg" alt="" className="h-14 w-auto max-h-16 object-contain" />
    </button>
  );
}
