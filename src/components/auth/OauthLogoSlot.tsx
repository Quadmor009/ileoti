/** Continue-with-Google area: light frame + Ile Oti red logo (SVGs scale; share a 2–3× PNG only if it looks soft). */
export function OauthLogoSlot({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="w-[180px] h-[72px] rounded-[22px] bg-white border border-[#E5E5E5] flex items-center justify-center px-4"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img src="/logos/red-logo.svg" alt="" className="h-[3.25rem] w-auto max-h-[4.5rem] object-contain" />
    </button>
  );
}
