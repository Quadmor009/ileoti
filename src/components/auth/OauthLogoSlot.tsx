/** Continue-with-Google: logo-only control (no outer stroke on modals). */
export function OauthLogoSlot({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="w-[180px] h-[72px] rounded-[22px] bg-transparent border-0 shadow-none flex items-center justify-center px-4"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img src="/logos/red-logo.svg" alt="" className="h-[3.25rem] w-auto max-h-[4.5rem] object-contain" />
    </button>
  );
}
